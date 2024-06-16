const db = require("~/models");
const { Op } = require('sequelize');
export const createVoucher = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { voucherType, voucherKind, voucherValue, maxDiscount, minPurchaseAmount, startDate, endDate } = data;
            const voucher = await db.Voucher.create({
                voucherType: voucherType,
                voucherKind: voucherKind,
                voucherValue: voucherValue,
                maxDiscount: maxDiscount,
                minPurchaseAmount: minPurchaseAmount,
                startDate: startDate,
                endDate: endDate
            })
            resolve({
                success: true,
                voucher: voucher
            });
        } catch (error) {
            reject(error);
        }
    });

// export const getAllVouchers = () =>
//     new Promise(async (resolve, reject) => {
//         try {
//             const vouchers = await db.Voucher.findAll({
//                 raw: true
//             });
//             resolve({
//                 success: true,
//                 vouchers: vouchers
//             });
//         } catch (error) {
//             console.log(error);
//             reject(error);
//         }
//     });

export const updateVoucher = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let voucherData = {};
            voucherData.errMessage = null;
            voucherData.voucher = {};
            voucherData.success = false;
            const id = data.params.id;
            const body = data.body;
            let voucher = await db.Voucher.findOne({
                where: {
                    id: id,
                },
                raw: false
            });

            if (!voucher) {
                voucherData.errMessage = "Voucher not found"
            } else {
                voucher.voucherType = body.voucherType;
                voucher.voucherKind = body.voucherKind;
                voucher.voucherValue = body.voucherValue;
                voucher.maxDiscount = body.maxDiscount;
                voucher.minPurchaseAmount = body.minPurchaseAmount;
                voucher.startDate = body.startDate;
                voucher.endDate = body.endDate;
                const response = await voucher.save();
                voucherData.success = true;
                voucherData.voucher = response;
            }
            resolve(voucherData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteVoucher = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.id;
            const response = await db.Voucher.destroy({
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

export const getVoucherDetails = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let voucherData = {};
            voucherData.errMessage = null;
            voucherData.success = false;
            voucherData.voucher = {};
            const voucher = await db.Voucher.findOne({
                where: {
                    id: data
                },
            })
            if (!voucher) {
                voucherData.errMessage = "Voucher not found";
            } else {
                voucherData.voucher = voucher;
                voucherData.success = true;
            }
            resolve(voucherData);
        } catch (error) {
            reject(error);
        }
    });

export const checkVoucherApply = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.params.id;
            let voucherData = {};
            voucherData.errMessage = null;
            voucherData.success = false;
            voucherData.voucher = null;
            let voucher = await db.Voucher.findOne({
                where: {
                    id: id,
                    voucherType: "total purchase",
                    startDate: {
                        [Op.lte]: new Date(),
                    },
                    endDate: {
                        [Op.gte]: new Date(),
                    }
                },
            })
            console.log(data.user.id);
            if (voucher) {
                let userVoucher = await db.UserVoucher.findOne({
                    where: {
                        voucherId: id,
                        userId: data.user.id,
                        isUsed: true,
                    },
                })
                if (!userVoucher) {
                    voucherData.voucher = voucher;
                    voucherData.success = true;
                }
                else {
                    voucherData.errMessage = "Voucher's used by this user";
                }
            } else {
                voucherData.errMessage = "Voucher not found";
            }
            resolve(voucherData);
        } catch (error) {
            reject(error);
        }
    });