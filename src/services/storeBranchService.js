const db = require("~/models");

export const createStoreBranch = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const t = await db.sequelize.transaction();
            const { branchName, province, district, address } = data;
            const storeBranch = await db.StoreBranch.create({
                branchName: branchName,
                province: province,
                address: address,
                district: district
            }, { transaction: t });
            const allProductVariants = await db.ProductVariant.findAll({ attributes: ['id'] });

            for (const productVariant of allProductVariants) {
                const newInventory = await db.Inventory.create({
                    stock: 0,
                    productVariantId: productVariant.id,
                    storeBranchId: storeBranch.id
                }, { transaction: t });

                await db.InventoryHistory.create({
                    status: "in",
                    reference: "initial",
                    quantity: 0,
                    inventoryId: newInventory.id,
                    currentStock: 0
                }, { transaction: t });
            }
            await t.commit();
            resolve({
                success: true,
                storeBranch: storeBranch
            });
        } catch (error) {
            await t.rollback();
            console.log(error);
            reject(error);
        }
    });

export const getAllStoreBranches = () =>
    new Promise(async (resolve, reject) => {
        try {
            const storeBranches = await db.StoreBranch.findAll({
                raw: true
            });
            resolve({
                code: 200,
                message: "Get branch data success",
                data: storeBranches
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const updateStoreBranch = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let storeBranchData = {};
            storeBranchData.errMessage = null;
            storeBranchData.storeBranch = {};
            storeBranchData.success = false;
            const id = data.params.id;
            const body = data.body;
            let storeBranch = await db.StoreBranch.findOne({
                where: {
                    id: id,
                },
                raw: false
            });

            if (!storeBranch) {
                storeBranchData.errMessage = "Store not found"
            } else {
                storeBranch.branchName = body.branchName;
                storeBranch.address = body.address;
                storeBranch.province = body.province;
                await storeBranch.save();
                storeBranchData.success = true;
                storeBranchData.storeBranch = response;
            }
            resolve(storeBranchData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteStoreBranch = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const id = data.id;
            const response = await db.StoreBranch.destroy({
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