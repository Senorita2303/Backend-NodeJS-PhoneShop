const db = require("~/models");
const cloudinary = require("cloudinary").v2;

export const createBrand = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            const { name, desc, headQuarters, country } = data;
            const brand = await db.Brand.create({
                name: name,
                desc: desc,
                headQuarters: headQuarters,
                country: country,
                image: fileData.path
            })
            resolve({
                success: true,
                brand: brand
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllBrands = () =>
    new Promise(async (resolve, reject) => {
        try {
            const brands = await db.Brand.findAll()
            resolve({
                success: true,
                brands: brands
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateBrand = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let brandData = {};
            brandData.errMessage = null;
            const id = data.params.id;
            const body = data.body;
            let brand = await db.Brand.findOne({
                where: {
                    id: id,
                },
                raw: false
            });

            if (!brand) {
                brandData.errMessage = "Brand not found"
            } else {
                const urlString = brand.image;
                const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
                let imageId = "";
                const match = urlString.match(regex);
                if (match) {
                    imageId = match[1];
                }
                if (fileData) {
                    await cloudinary.uploader.destroy(imageId);
                    brand.image = fileData?.path;
                }
                brand.name = body.name;
                brand.desc = body.desc;
                brand.headQuarters = body.headQuarters;
                brand.country = body.country;
                await brand.save();
                brandData.success = true;
                brandData.brand = brand;
            }
            resolve(brandData);
        } catch (error) {
            reject(error);
            cloudinary.uploader.destroy(fileData.filename);
        }
    });

export const deleteBrand = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const brand = await db.Brand.findOne({
                where: {
                    id: data
                },
            })
            const urlString = brand.image;

            // Sử dụng regex để trích xuất phần cần thiết từ dấu "/" thứ 2 từ cuối và loại bỏ phần mở rộng
            const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
            let imageId = "";
            const match = urlString.match(regex);
            if (match) {
                imageId = match[1];
            }
            await cloudinary.uploader.destroy(imageId);
            const response = await db.Brand.destroy({
                where: {
                    id: data
                },
            });
            resolve({
                success: true,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getBrandDetails = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let brandData = {};
            brandData.errMessage = null;
            brandData.success = false;
            brandData.brand = {};
            const brand = await db.Brand.findOne({
                where: {
                    id: data
                },
            })
            if (!brand) {
                brandData.errMessage = "Brand not found";
            } else {
                brandData.brand = brand;
                brandData.success = true;
            }
            resolve(brandData);
        } catch (error) {
            reject(error);
        }
    });