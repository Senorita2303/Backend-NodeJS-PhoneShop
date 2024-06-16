const db = require("~/models");
const inventory = db.Inventory;
const productVariant = db.ProductVariant;
const inventoryHistory = db.InventoryHistory;
const discount = db.Discount;
const color = db.Color;
const memory = db.Memory;
const storeBranch = db.StoreBranches;
const { Op } = require("sequelize");
const { literal } = require('sequelize');

export const fetchAllInventories = async (req, res) => {
    try {
        const branchId = req.query.branchId;
        const page = parseInt(req.query.page) || 1;
        const pageSize = 12;

        const color_id = parseInt(req.query.color) || null;
        const memory_id = parseInt(req.query.memory) || null;
        const productVariantName = req.query.name || null;
        const sort = req.query.sort || "ASC";
        const order = req.query.order === "price" ? 'discounted_price' : "`ProductVariant.name`";
        const admin = req.query.adm || null;

        const colorQuery = color_id ? { colorId: color_id } : {};
        const memoryQuery = memory_id ? { memoryId: memory_id } : {};
        const productVariantQuery = productVariantName ? { name: { [Op.like]: `%${productVariantName}%` } } : {};
        const stockQuery = !admin ? { stock: { [Op.gte]: 1 } } : {};

        const allInventories = await db.Inventory.findAndCountAll({
            where: {
                storeBranchId: branchId,
                ...stockQuery
            },
            include: [
                {
                    model: productVariant,
                    as: 'productVariant',
                    where: { ...colorQuery, ...memoryQuery, ...productVariantQuery },
                    include: [
                        { model: color, as: 'color', attributes: ['name'] },
                        { model: memory, as: 'memory', attributes: ['ram', 'rom', 'chipset'] },
                    ]
                },
                {
                    model: discount,
                    as: 'discounts',
                    attributes: ['discountType', 'discountValue', 'startDate', 'endDate', 'inventoryId'],
                    where: {
                        endDate: {
                            [Op.gte]: new Date(),
                        },
                    },
                    required: false,
                },
            ],
            raw: true,
            nest: true,
            // attributes: {
            //     include: [
            //         [
            //             literal("`ProductVariant`.`price` -  IFNULL((select case when d.discountType =  'percentage' then `ProductVariant`.`price` *  d.discountValue * 0.01 when d.discountType =  'amount' then  d.discountValue when d.discountType = 'buy one get one' then 0 end as discount from Discounts d where d.inventoryId = `Inventory`.`id` and endDate >= CURDATE() and startDate <= CURDATE() limit 1),0)"),
            //             'discounted_price',
            //         ],
            //     ],
            // },
            // order: [[literal(order), sort]],
            // limit: pageSize,
            // offset: (page - 1) * pageSize,
        });

        res.status(200).send({
            isError: false,
            message: "Successfully fetch inventories",
            data: allInventories.rows,
            count: allInventories.count,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            isError: true,
            message: "Fetch inventories failed",
        });
        // return res.status(StatusCodes.BAD_REQUEST).json({
        //     message: "Lỗi server",
        //     status: StatusCodes.BAD_REQUEST
        // })
    }
};

export const findInventory = async (req, res) => {
    try {
        const branchId = req.query.branchId
        const inventoryId = req.params.idInventory;
        let findInventory = await inventory.findOne({ where: { id: inventoryId } });
        if (!findInventory) {
            return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true });
        } else if (findInventory.id_branch != branchId) {
            return res.status(404).send({ isError: true, message: "Id branch not valid", navigate: true });
        }

        res.status(200).send({
            status: "Successfully find inventory",
            data: findInventory,
            navigate: false
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({ isError: true, message: "Find inventory failed" });
    }
};

export const findInventoryHistory = async (req, res) => {
    try {
        let { productName, orderBy, orderByMethod, branchId, startDate, endDate, page, limit, } = req.query;
        const mapOrderBy = { id: "Inventory_Histories.id", productName: "CombinedQuery.productName", createdAt: "Inventory_Histories.createdAt", };
        productName = productName ? `%${productName}%` : ""; // formating that for like query
        orderBy = mapOrderBy[orderBy] || "Inventory_Histories.id"; // Default to 'Inventory_Histories.id' if not provided
        orderByMethod = orderByMethod || "ASC"; // Default to 'ASC' if not provided
        branchId = branchId || ""; // Empty string if not provided
        startDate = startDate || "1970-01-01 00:00:00"; // Default to a very early date if not provided
        endDate = endDate || "9999-12-31 23:59:59"; // Default to a very late date if not provided
        page = parseInt(page) || 1; // Default to 1 if not provided or invalid
        limit = parseInt(limit) || 10; // Default to 10 if not provided or invalid
        const offset = (page - 1) * limit;
        const query = `
    SELECT
        Inventory_Histories.id,
        CombinedQuery.productName,
        CombinedQuery.branchName,
        Inventory_Histories.status,
        Inventory_Histories.reference,
        Inventory_Histories.quantity,
        Inventory_Histories.createdAt,
        Inventory_Histories.updatedAt,
        Inventory_Histories.current_stock
    FROM
        (
            SELECT
                Inventories.id,
                Inventories.stock AS inventory_stock,
                Products.product_name AS productName,
                Store_Branches.branch_name AS branchName
            FROM
                Inventories
            JOIN
                Products ON Inventories.id_product = Products.id
            JOIN 
                Store_Branches ON Inventories.id_branch = Store_Branches.id            
            WHERE
                ${branchId ? "Inventories.id_branch = :branchId" : "1 = 1"}
        ) AS CombinedQuery
    JOIN
        Inventory_Histories ON Inventory_Histories.id_inventory = CombinedQuery.id
    WHERE
        ${productName ? "CombinedQuery.productName LIKE :productName" : "1 = 1"}
        AND Inventory_Histories.createdAt BETWEEN :startDate AND :endDate
    ORDER BY
        ${orderBy} ${orderByMethod}
        LIMIT :limit
        OFFSET :offset;
  `;

        const countQuery = `
    SELECT COUNT(*) AS total
    FROM
        (
            SELECT
                Inventories.id,
                Products.product_name AS productName
            FROM
                Inventories
            JOIN
                Products ON Inventories.id_product = Products.id
            WHERE
                ${branchId ? "Inventories.id_branch = :branchId" : "1 = 1"}
        ) AS CombinedQuery
    JOIN
        Inventory_Histories ON Inventory_Histories.id_inventory = CombinedQuery.id
    WHERE
        ${productName ? "CombinedQuery.productName LIKE :productName" : "1 = 1"}
        AND Inventory_Histories.createdAt BETWEEN :startDate AND :endDate;
  `;

        const result = await db.sequelize.query(query, { replacements: { branchId, productName, startDate, endDate, limit, offset, }, });
        const countResult = await db.sequelize.query(countQuery, { replacements: { branchId, productName, startDate, endDate, }, });
        const totalItems = countResult[0][0].total;
        const totalPages = Math.ceil(totalItems / limit);
        console.log(countResult[0][0].total, "count result");
        const data = { totalItems, totalPages, currentPage: page, items: result[0], };
        return res.status(200).send({ status: "Successfully find invesssntory", data: data, });
    } catch (error) {
        console.log(error);
        res.status(404).send({ isError: true, message: "Find inventory failed" });
    }
};

export const getInventoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const inventoryData = await db.Inventory.findOne({
            where: {
                id: id,
                // stock: {
                //     [Op.gte]: 1,
                // }
            },
            // include: [{
            //     model: product
            // },
            // {
            //     model: discount,
            //     where: {
            //         end_date: {
            //             [Op.gte]: new Date(),
            //         }
            //     },
            //     required: false,
            // }
            // ],
            // attributes: {
            //     include: [
            //         [
            //             literal("`Product`.`product_price` -  IFNULL((select case when d.discount_type =  'percentage' then `Product`.`product_price` *  d.discount_value * 0.01 when d.discount_type =  'amount' then  d.discount_value when d.discount_type = 'buy one get one' then 0 end as discount from Discounts d where d.id_inventory = `Inventory`.`id` and end_date >= CURDATE() and start_date <= CURDATE() limit 1),0)"),
            //             'discounted_price',
            //         ],
            //     ],
            // },
        })

        if (!inventoryData) {
            return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true })
        }

        res.status(200).send({
            isError: false,
            message: "Successfully fetch inventory by id",
            inventory: inventoryData,
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({ isError: true, message: "Fetch inventory by Id failed" })
    }
};

export const updateStock = async (req, res) => {
    try {
        const id = req.params.id;
        const { stock, status, quantity } = req.body;

        const inventoryData = await db.Inventory.findOne({
            where: { id: id }
        })

        if (!inventoryData) {
            return res.status(404).send({ isError: true, message: "Inventory not exist", navigate: true })
        }
        if (status === 'out' && inventoryData.stock < quantity) {
            return res.status(404).send({ isError: true, message: "Can't reduce quantity more than available stock", navigate: true })
        }
        const data = await db.Inventory.update({
            stock: stock
        }, {
            where: { id: id },
        })

        const result = await db.InventoryHistory.create({
            status: status,
            reference: 'manual',
            quantity: quantity,
            inventoryId: id,
            currentStock: stock
        })

        res.status(200).send({
            isError: false,
            message: "Successfully update stock",
            data: result
        });
    } catch (error) {
        res.status(404).send({ isError: true, message: "Update stock failed" })
    }
};
