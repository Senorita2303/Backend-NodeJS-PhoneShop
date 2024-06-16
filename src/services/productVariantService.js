const db = require("~/models");
const ApiFeatures = require("~/utils/apiFeatures");
const cloudinary = require("cloudinary").v2;
const { Op } = require('sequelize');

export const createProductVariant = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let productVariantData = {};
            productVariantData.errMessage = null;
            productVariantData.productVariant = {};
            productVariantData.success = false;
            const { name, sku, stock, marketPrice, colorId, memoryId, productId } = data;
            let product = await db.Product.findOne({
                attributes: ['id', 'discountPercentage'],
                where: {
                    id: productId,
                }
            });
            if (product) {
                let color = await db.Color.findOne({
                    where: {
                        id: colorId,
                    }
                });
                if (color) {
                    let memory = await db.Memory.findOne({
                        where: {
                            id: memoryId,
                        }
                    });
                    if (memory) {
                        let price = Math.round((100 - product.discountPercentage) * marketPrice / 100 / 10000) * 10000;
                        const newProductVariant = await db.ProductVariant.create({
                            name: name,
                            sku: sku,
                            stock: stock,
                            price: price,
                            marketPrice: marketPrice,
                            colorId: colorId,
                            memoryId: memoryId,
                            productId: productId
                        });
                        productVariantData.productVariant = newProductVariant
                        productVariantData.success = true;
                        for (let data of fileData) {
                            await db.ProductImage.create({
                                name: data.filename,
                                imageUrl: data.path,
                                originalName: data.originalname,
                                fileSize: data.size,
                                productVariantId: newProductVariant.id
                            });
                        }
                        const branches = await db.StoreBranch.findAll();
                        for (const branch of branches) {
                            const newInventory = await db.Inventory.create({
                                productVariantId: newProductVariant.id,
                                storeBranchId: branch.id,
                                stock: 0
                            });

                            const initStock = await db.InventoryHistory.create({
                                status: "in",
                                reference: "initial",
                                quantity: 0,
                                inventoryId: newInventory.id,
                                currentStock: 0
                            });
                        }
                    } else {
                        productVariantData.errMessage = `Memory ${memoryId} not found!`
                    }
                } else {
                    productVariantData.errMessage = `Color ${colorId} not found!`
                }
            } else {
                productVariantData.errMessage = `Product ${productId} not found!`
            }
            resolve(productVariantData);
        } catch (error) {
            reject(error);
        }
    });

export const getAllProductVariants = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { keyword, page, price } = data?.query;
            let MiN = parseInt(price.gte);
            let MaX = parseInt(price.lte);
            const resultPerPage = 10; // Number of productVariants visible per page
            const productVariantsCount = await db.ProductVariant.count(); // Get total number of productVariants
            const productVariantList = await db.ProductVariant.findAll({
                attributes: ["createdAt", "brandId", "categoryId", "id", "name", "desc", "video", "basePrice", "discountPercentage", "thumbUrl"],
                where: {
                    name: {
                        [Op.like]: `%${keyword}%`
                    },
                    basePrice: {
                        [Op.and]: {
                            [Op.gt]: MiN,
                            [Op.lte]: MaX,
                        }
                    }
                }
            });
            resolve({
                success: true,
                productVariants: productVariantList,
                productVariantsCount: productVariantsCount,
                resultPerPage: resultPerPage,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const getAllProductVariantsAdmin = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.ProductVariant.findAll({
                attributes: ["id", "name", "sku", "price", "marketPrice"],
                // include: [
                //     { model: db.Category, as: 'category', attributes: ['name'] },
                //     { model: db.Brand, as: 'brand', attributes: ['name'] }
                // ],
                // raw: false,
                // nest: true
            });
            resolve({
                success: true,
                productVariants: response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateProductVariant = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let productVariantData = {};
            productVariantData.errMessage = null;
            productVariantData.productVariant = {};
            let productVariant = await db.ProductVariant.findOne({
                where: {
                    id: data.params.id,
                }
            });
            if (!productVariant) {
                productVariantData.errMessage = "ProductVariant not found"
            }
            else {
                const urlString = productVariant.thumbUrl;
                const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
                let imageId = "";
                const match = urlString.match(regex);
                if (match) {
                    imageId = match[1];
                }
                if (fileData) {
                    await cloudinary.uploader.destroy(imageId);
                    data.body.image = fileData?.path;
                }
                const updateProductVariant = await db.ProductVariant.update(data.body, {
                    where: {
                        id: id,
                    },
                });
                productVariantData.success = true;
                productVariantData.productVariant = updateProductVariant;
            }
            resolve(productVariantData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteProductVariant = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const productVariant = await db.ProductVariant.findOne({
                attributes: ["id", "thumbUrl"],
                where: {
                    id: data
                },
            })
            const urlString = productVariant.thumbUrl;
            const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
            let imageId = "";
            const match = urlString.match(regex);
            if (match) {
                imageId = match[1];
            }
            await cloudinary.uploader.destroy(imageId);
            const response = await db.ProductVariant.destroy({
                where: {
                    id: data
                },
            });
            resolve({
                success: true,
                message: "ProductVariant delete successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getProductVariantDetails = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let productVariants = await db.ProductVariant.findAll({
                where: {
                    productId: data
                },
                include: [
                    { model: db.Memory, as: 'memory', attributes: ['rom'] },
                    { model: db.Color, as: 'color', attributes: ['name'] },
                    { model: db.ProductImage, as: 'images', attributes: ['imageUrl'] },
                ],
                raw: true,
                nest: true
            });
            const variantMap = {};

            productVariants.forEach(variant => {
                if (!variantMap[variant.id]) {
                    variantMap[variant.id] = {
                        ...variant,
                        images: []
                    };
                }
                variantMap[variant.id].images.push(variant.images.imageUrl);
            });

            // Chuyển đổi đối tượng variantMap thành mảng kết quả
            const result = Object.values(variantMap);
            resolve({
                success: true,
                productVariants: result,
            });
        } catch (error) {
            reject(error);
        }
    });
