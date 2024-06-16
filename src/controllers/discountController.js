const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
const db = require("~/models");
const { Op } = require('sequelize');
const moment = require("moment");

// Create Discount Admin route 
export const createDiscount = async (req, res) => {
    try {
        const { inventoryId, discountType, discountValue, startDate, endDate } = req.body;
        if (!inventoryId || !discountType || !startDate || !endDate) {
            return res.status(400).send({
                isError: true,
                message: "Please complete the data"
            })
        }

        if (discountType === "percentage" || discountType === "amount") {
            if (!discountValue) {
                return res.status(400).send({
                    isError: true,
                    message: "Please provide a discount value",
                });
            }
        }

        let data = { ...req.body }

        const now = new Date();
        now.setHours(0, 0, 0, 0)
        if (new Date(startDate) < now) {
            return res.status(400).send({
                isError: true,
                message: "Start date must be after today"
            })
        }

        if (new Date(endDate) <= new Date(startDate)) {
            return res.status(400).send({
                isError: true,
                message: "End date must be after Start date"
            })
        }

        const discountsExist = await db.Discount.findAll({
            attributes: ["id", "discountType", "discountValue", "startDate", "endDate", "inventoryId"],
            where: {
                inventoryId: inventoryId,
                startDate: {
                    [Op.lte]: endDate
                },
                endDate: {
                    [Op.gte]: startDate
                }
            }
        })

        if (discountsExist.length > 0) {
            return res.status(400).send({
                isError: true,
                message: "An existing discount is still running"
            })
        }

        const discountedProduct = await db.Inventory.findOne({
            attributes: ["id", "stock", "storeBranchId", "productVariantId"],
            where: {
                id: inventoryId,
            },
            include: {
                model: db.ProductVariant,
                as: "productVariant",
                attributes: ["price"]
            },
            raw: true,
            nest: true
            // include: product
        })

        if (discountedProduct.stock < 1) {
            return res.status(400).send({
                isError: true,
                message: "Insufficient stock"
            })
        }

        if (discountType === "percentage" && discountValue > 100) {
            return res.status(400).send({
                isError: true,
                message: "Discount value cannot be greater than 100"
            })
        }

        if (discountType === "amount" && discountValue >= discountedProduct.productVariant.price) {
            return res.status(400).send({
                isError: true,
                message: "Discount value cannot be greater than or equal to the product's price"
            })
        }

        if (discountType === "buy one get one" && discountedProduct.stock < 2) {
            return res.status(400).send({
                isError: true,
                message: "Insufficient stock"
            })
        }
        const result = await db.Discount.create({
            inventoryId: inventoryId,
            discountType: discountType,
            discountValue: discountValue,
            startDate: startDate,
            endDate: endDate
        })
        res.status(200).send({
            isError: false,
            success: "Successfully create a new discount",
            data: result
        })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all discount 
export const getAllDiscounts = async (req, res) => {
    try {
        // const response = await services.getAllDiscounts(req);
        // return res.status(StatusCodes.OK).json(response);
        const page = parseInt(req.query.page) || 1;
        const pageSize = 12;
        // const sort = req.query.sort || "ASC";
        const productName = req.query.name || null;
        const discountType = req.query.type || null;
        const branchId = req.query.branchId || 1;
        const typeQuery = discountType ? { discountType: discountType } : {};
        const searchQuery = productName ? { name: { [Op.like]: `%${productName}%` } } : {};

        let inventoryIds = [];

        if (productName) {
            const products = await db.ProductVariant.findAll({
                attributes: ["id"],
                where: searchQuery,
                // include: {
                //     model: db.Inventory,
                //     as: "inventories",
                //     attributes: ["id", "stock", "productVariantId", "storeBranchId"],
                //     where: {
                //         storeBranchId: branchId
                //     },
                // },
            });

            if (!products) {
                return res.status(200).send({
                    isError: false,
                    message: "No discounts found",
                    data: [],
                    count: 0,
                });
            }

            const productIds = products.map((product) => product.id);

            const inventories = await db.Inventory.findAll({
                attributes: ["stock", "productVariantId", "id", "storeBranchId"],
                where: {
                    productVariantId: productIds,
                },
            });

            if (!inventories) {
                return res.status(200).send({
                    isError: false,
                    message: "No discounts found",
                    data: [],
                    count: 0,
                });
            }

            inventoryIds = inventories.map((inv) => inv.id);
        }

        const searchInventory = productName ? { inventoryId: inventoryIds } : {};

        const result = await db.Discount.findAndCountAll({
            attributes: ['id', 'discountType', 'discountValue', 'startDate', 'endDate', 'inventoryId'],
            where: {
                ...searchInventory,
                ...typeQuery,
            },
            include: {
                model: db.Inventory,
                as: "inventory",
                attributes: ["stock", "productVariantId", "id", "storeBranchId"],
                where: {
                    storeBranchId: branchId
                },
                include: {
                    model: db.ProductVariant,
                    as: "productVariant",
                    attributes: ["name"]
                }
            },
            // order: [[{ model: db.Inventory, as: "inventory", }, { model: db.ProductVariant, as: "productVariant" }, 'name', sort]],
            // limit: pageSize,
            // offset: (page - 1) * pageSize,
            raw: true,
            nest: true,
        })

        res.status(200).send({
            isError: true,
            message: "Successfully get all discounts",
            data: result.rows,
            count: result.count,
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            isError: true,
            message: "Error get all discounts",
        });
        // return res.status(StatusCodes.BAD_REQUEST).json({
        //     message: "Lỗi server",
        //     status: StatusCodes.BAD_REQUEST
        // })
    }
};

// Update admin route
export const updateDiscount = async (req, res) => {
    try {
        const response = await services.updateDiscount(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete discount -- admin
export const deleteDiscount = async (req, res) => {
    try {
        const response = await services.deleteDiscount(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Detils of discount
export const getDiscountDetails = async (req, res) => {
    try {
        const response = await services.getDiscountDetails(req.params.id);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};