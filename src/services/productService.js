const db = require("~/models");
const ApiFeatures = require("~/utils/apiFeatures");
const cloudinary = require("cloudinary").v2;
const { Op } = require('sequelize');

export const createProduct = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let productData = {};
            productData.errMessage = null;
            productData.product = {};
            productData.success = null;
            const { warrantyPeriod, name, desc, brandId, categoryId, basePrice, discountPercentage, video, specList, contentHTML, contentMarkdown } = data;
            let category = await db.Category.findOne({
                where: {
                    id: categoryId,
                }
            });
            if (category) {
                let brand = await db.Brand.findOne({
                    where: {
                        id: brandId,
                    }
                });
                if (brand) {
                    await db.Brand.increment("countProduct", {
                        by: 1,
                        where: {
                            id: brandId,
                        }
                    });
                    await db.Category.increment("countProduct", {
                        by: 1,
                        where: {
                            id: categoryId,
                        }
                    });
                    const newProduct = await db.Product.create({
                        name: name,
                        video: video,
                        desc: desc,
                        thumbUrl: fileData.path,
                        discountPercentage: discountPercentage,
                        slug: name,
                        basePrice: basePrice,
                        warrantyPeriod: warrantyPeriod,
                        brandId: brandId,
                        categoryId: categoryId
                    })
                    productData.product = newProduct
                    productData.success = true;
                    let detailSpecs = JSON.parse(specList);
                    for (let spec of detailSpecs) {
                        await db.ProductSpecification.create({
                            specValue: spec.value,
                            productId: newProduct.id,
                            specsId: spec.name,
                        });
                    }
                    await db.Markdown.create({
                        contentHTML: contentHTML,
                        contentMarkdown: contentMarkdown,
                        productId: newProduct.id
                    })
                } else {
                    productData.errMessage = `Brand ${brandId} not found!`
                }
            } else {
                productData.errMessage = `Category ${categoryId} not found!`
            }
            resolve(productData);
        } catch (error) {
            reject(error);
        }
    });

export const getAllProducts = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { keyword, page, price } = data?.query;
            let MiN = parseInt(price.gte);
            let MaX = parseInt(price.lte);
            const resultPerPage = 10; // Number of products visible per page
            const productsCount = await db.Product.count(); // Get total number of products
            const productList = await db.Product.findAll({
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
            // Create an instance of the ApiFeatures class, passing the ProductModel.find() query and req.query (queryString)
            // const apiFeature = new ApiFeatures(productList, req.query)
            //     .search() // Apply search filter based on the query parameters
            //     .filter() // Apply additional filters based on the query parameters
            //     .pagination(resultPerPage);
            // // let products = await apiFeature.query; // Fetch the products based on the applied filters and search

            // // let filteredProductCount = products.length; // Number of products after filtering (for pagination)

            // // apiFeature.Pagination(resultPerPage); // Apply pagination to the products

            // // Mongoose no longer allows executing the same query object twice, so use .clone() to retrieve the products again
            // const products = await apiFeature.query; // Retrieve the paginated products
            resolve({
                success: true,
                products: productList,
                productsCount: productsCount,
                resultPerPage: resultPerPage,
                // filteredProductCount: filteredProductCount,
            });
            console.log(products, productsCount, resultPerPage);
        } catch (error) {
            reject(error);
        }
    });

export const getAllProductsAdmin = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Product.findAll({
                attributes: ["createdAt", "brandId", "categoryId", "id", "name", "desc", "video", "basePrice", "discountPercentage", "thumbUrl"],
                // include: [
                //     { model: db.Category, as: 'category', attributes: ['name'] },
                //     { model: db.Brand, as: 'brand', attributes: ['name'] }
                // ],
                // raw: false,
                // nest: true
            });
            resolve({
                success: true,
                products: response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateProduct = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let productData = {};
            productData.errMessage = null;
            productData.product = {};
            let product = await db.Product.findOne({
                where: {
                    id: data.params.id,
                }
            });
            if (!product) {
                productData.errMessage = "Product not found"
            }
            else {
                const urlString = product.thumbUrl;
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
                const updateProduct = await db.Product.update(data.body, {
                    where: {
                        id: id,
                    },
                });
                productData.success = true;
                productData.product = updateProduct;
            }
            resolve(productData);
        } catch (error) {
            reject(error);
        }
    });

export const deleteProduct = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const product = await db.Product.findOne({
                attributes: ["id", "thumbUrl"],
                where: {
                    id: data
                },
            })
            const urlString = product.thumbUrl;

            // Sử dụng regex để trích xuất phần cần thiết từ dấu "/" thứ 2 từ cuối và loại bỏ phần mở rộng
            const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
            let imageId = "";
            const match = urlString.match(regex);
            if (match) {
                imageId = match[1];
            }
            await cloudinary.uploader.destroy(imageId);
            const response = await db.Product.destroy({
                where: {
                    id: data
                },
            });
            resolve({
                success: true,
                message: "Product delete successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getProductDetails = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let product = await db.Product.findOne({
                attributes: ['id', 'name', 'desc', 'video', 'thumbUrl', 'discountPercentage', 'basePrice', 'warrantyPeriod'],
                where: {
                    id: data
                },
            });
            let markdown = await db.Markdown.findOne({
                where: {
                    productId: product.id
                }
            });
            let productData = {
                id: product.id,
                name: product.name,
                desc: product.desc,
                video: product.video,
                thumbUrl: product.thumbUrl,
                discountPercentage: product.discountPercentage,
                basePrice: product.basePrice,
                warrantyPeriod: product.warrantyPeriod,
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown
            }
            const productSpec = await db.ProductSpecification.findAll({
                attributes: ["specValue", "specsId"],
                where: {
                    productId: data
                },
            });
            for (let spec of productSpec) {
                if (spec.specsId === 1) {
                    spec.specsId = "Màn hình"
                }
                if (spec.specsId === 2) {
                    spec.specsId = "Camera trước"
                }
                if (spec.specsId === 3) {
                    spec.specsId = "Camera sau"
                }
                if (spec.specsId === 4) {
                    spec.specsId = "Hệ điều hành & CPU"
                }
                if (spec.specsId === 5) {
                    spec.specsId = "Bộ nhớ và lưu trữ"
                }
                if (spec.specsId === 6) {
                    spec.specsId = "Kết nối"
                }
                if (spec.specsId === 7) {
                    spec.specsId = "Pin & Sạc"
                }
                if (spec.specsId === 8) {
                    spec.specsId = "Tiện ích"
                }
                if (spec.specsId === 9) {
                    spec.specsId = "Thiết kế"
                }
            }
            const grouped = {};

            // Duyệt qua specList và nhóm các phần tử theo name
            productSpec.forEach(spec => {
                const [x, y] = spec.specValue.split('|');
                if (!grouped[spec.specsId]) {
                    grouped[spec.specsId] = [];
                }
                grouped[spec.specsId].push({ key: x, value: y });
            });

            // Chuyển đổi đối tượng grouped thành mảng với cấu trúc mong muốn
            const newSpecList = Object.keys(grouped).map(groupName => ({
                groupName,
                groupList: grouped[groupName]
            }));
            resolve({
                detailSpec: newSpecList,
                success: true,
                product: productData,
            });
        } catch (error) {
            reject(error);
        }
    });
