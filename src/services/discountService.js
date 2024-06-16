const db = require("~/models");

export const createDiscount = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { productId, discountType, discountValue, startDate, endDate } = data;
            console.log(data);
            const discount = await db.Discount.create({
                productId: productId,
                discountType: discountType,
                discountValue: discountValue,
                startDate: startDate,
                endDate: endDate
            })
            resolve({
                success: true,
                discount: discount
            });
        } catch (error) {
            reject(error);
        }
    });

// export const getAllDiscounts = (req) =>
//     new Promise(async (resolve, reject) => {
//         try {
//             const page = parseInt(req.query.page) || 1;
//             const pageSize = 12;
//             const sort = req.query.sort || "ASC";
//             const productName = req.query.name || null;
//             const discountType = req.query.type || null;
//             const branchId = req.query.branchId || 1;
//             const typeQuery = discountType ? { discountType: discountType } : {};
//             const searchQuery = productName ? { name: { [Op.like]: `%${productName}%` } } : {};

//             let inventoryIds = [];
//             const discounts = await db.Discount.findAll({
//                 raw: true
//             });
//             resolve({
//                 success: true,
//                 discounts: discounts
//             });
//         } catch (error) {
//             console.log(error);
//             reject(error);
//         }
//     });

export const updateDiscount = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let discountData = {};
            discountData.errMessage = null;
            discountData.discount = {};
            discountData.success = false;
            const id = data.params.id;
            const body = data.body;
            let discount = await db.Discount.findOne({
                where: {
                    id: id,
                },
                raw: false
            });

            if (!discount) {
                discountData.errMessage = "Discount not found"
            } else {
                discount.discountType = body.discountType;
                discount.discountValue = body.discountValue;
                discount.startDate = body.startDate;
                discount.endDate = body.endDate;
                const response = await discount.save();
                discountData.success = true;
                discountData.discount = response;
            }
            resolve(discountData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteDiscount = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.id;
            const response = await db.Discount.destroy({
                where: {
                    id: id
                },
            });
            resolve({
                success: true,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getDiscountDetails = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let discountData = {};
            discountData.errMessage = null;
            discountData.success = false;
            discountData.discount = {};
            const discount = await db.Discount.findOne({
                where: {
                    id: data
                },
            })
            if (!discount) {
                discountData.errMessage = "Discount not found";
            } else {
                discountData.discount = discount;
                discountData.success = true;
            }
            resolve(discountData);
        } catch (error) {
            reject(error);
        }
    });