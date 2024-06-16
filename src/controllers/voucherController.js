const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
const db = require("~/models");
const { Op } = require('sequelize');

// Create Voucher Admin route 
export const createVoucher = async (req, res) => {
    try {
        const { voucherType, inventoryId, voucherKind, voucherValue, maxDiscount, minPurchaseAmount, startDate, endDate } = req.body;
        if (!voucherType || !voucherKind || !voucherValue || !startDate || !endDate) {
            return res.status(400).send({
                isError: true,
                message: "Please complete the data",
            });
        }

        if (voucherType === "total purchase" || voucherType === "shipping" || voucherType === "referral code") {

            const voucherExists = await db.Voucher.findOne({
                where: {
                    voucherType: voucherType,
                    startDate: {
                        [Op.lt]: endDate
                    },
                    endDate: {
                        [Op.gt]: startDate
                    }
                }
            })
            if (voucherExists) {
                return res.status(400).send({
                    isError: true,
                    message: `Active voucher with type ${voucherType} already exists`,
                });
            }
        }

        let data = { ...req.body };
        data.startDate = new Date(startDate)
        data.endDate = new Date(endDate)
        if (voucherType !== "total purchase") {
            data.minPurchaseAmount = null;
        }

        if (voucherKind === "amount") {
            data.maxDiscount = null;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (new Date(startDate) < now) {
            return res.status(400).send({
                isError: true,
                message: "Start date is invalid",
            });
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).send({
                isError: true,
                message: "End date is invalid",
            });
        }

        if (voucherKind === "percentage" && voucherValue > 100) {
            return res.status(400).send({
                isError: true,
                message: "Voucher value cannot be greater than 100%",
            });
        }

        if (voucherType === "product") {
            if (!inventoryId) {
                return res.status(400).send({
                    isError: true,
                    message: "Please choose a product",
                });
            }

            const voucherProductExists = await db.Voucher.findOne({
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

            if (voucherProductExists) {
                return res.status(400).send({
                    isError: true,
                    message: `Active voucher already exists`,
                });
            }

            const featuredProduct = await db.Inventory.findOne({
                where: {
                    id: inventoryId,
                },
                include: {
                    model: db.ProductVariant,
                    as: "productVariant",
                    attributes: ["price"]
                },
                raw: true,
                nest: true,
            });

            if (featuredProduct.stock < 1) {
                return res.status(400).send({
                    isError: true,
                    message: "Insufficient stock",
                });
            }

            if (voucherKind === "amount" && voucherValue > featuredProduct.productVariant.price) {
                return res.status(400).send({
                    isError: true,
                    message: "Voucher value cannot be greater than the product's price",
                });
            }

            const result = await db.Voucher.create(data);
            return res.status(200).send({
                isError: false,
                success: "Successfully create a new voucher",
                data: result,
            });
        }

        if (voucherType === "total purchase") {
            if (!minPurchaseAmount) {
                return res.status(400).send({
                    isError: true,
                    message: "Please complete the data",
                });
            }

            const result = await db.Voucher.create(data);
            return res.status(200).send({
                isError: false,
                success: "Successfully create a new voucher",
                data: result,
            });
        }

        const result = await db.Voucher.create(data);
        return res.status(200).send({
            isError: false,
            success: "Successfully create a new voucher",
            data: result,
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Get all voucher 
export const getAllVouchers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 12;
        // const sort = req.query.sort || "ASC";
        const voucherType = req.query.type || null;

        const typeQuery = voucherType ? { voucherType: voucherType } : {};

        const result = await db.Voucher.findAndCountAll({
            where: {
                ...typeQuery
            },
            include: {
                required: false,
                model: db.Inventory,
                as: "inventory",
                include: [
                    { model: db.ProductVariant, as: "productVariant" },
                    { model: db.StoreBranch, as: "storeBranch" },
                ]
            },
            raw: true,
            nest: true
        });

        res.status(200).send({
            isError: true,
            message: "Successfully get all vouchers",
            data: result.rows,
            count: result.count
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Update admin route
export const updateVoucher = async (req, res) => {
    try {
        const response = await services.updateVoucher(req);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};


// Delete voucher -- admin
export const deleteVoucher = async (req, res) => {
    try {
        const response = await services.deleteVoucher(req.params);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// Detils of voucher
export const getVoucherDetails = async (req, res) => {
    try {
        const response = await services.getVoucherDetails(req.params.id);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

export const checkVoucherApply = async (req, res) => {
    try {
        const response = await services.checkVoucherApply(req);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};