const db = require("~/models");
const cloudinary = require("cloudinary").v2;

export const createCategory = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            const { name, desc } = data;
            const category = await db.Category.create({
                name: name,
                desc: desc,
                image: fileData.path
            })
            resolve({
                success: true,
                category: category
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllCategories = () =>
    new Promise(async (resolve, reject) => {
        try {
            const categories = await db.Category.findAll()
            resolve({
                success: true,
                categories: categories
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateCategory = (data, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            let categoryData = {};
            categoryData.errMessage = null;
            const id = data.params.id;
            const body = data.body;
            let category = await db.Category.findOne({
                where: {
                    id: id,
                },
                raw: false
            });

            if (!category) {
                categoryData.errMessage = "Category not found";
            } else {
                const urlString = category.image;
                const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
                let imageId = "";
                const match = urlString.match(regex);
                if (match) {
                    imageId = match[1];
                }
                if (fileData) {
                    await cloudinary.uploader.destroy(imageId);
                    category.image = fileData?.path;
                }
                category.name = body.name;
                category.desc = body.desc;
                await category.save();
                categoryData.success = true;
                categoryData.category = category;
            }
            resolve(categoryData);
        } catch (error) {
            reject(error);
            cloudinary.uploader.destroy(fileData.filename);
        }
    });

export const deleteCategory = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const category = await db.Category.findOne({
                where: {
                    id: data
                },
            })
            const urlString = category.image;

            // Sử dụng regex để trích xuất phần cần thiết từ dấu "/" thứ 2 từ cuối và loại bỏ phần mở rộng
            const regex = /\/([^\/]+\/[^\/]+)\.[a-zA-Z0-9]+$/;
            let imageId = "";
            const match = urlString.match(regex);
            if (match) {
                imageId = match[1];
            }
            await cloudinary.uploader.destroy(imageId);
            const response = await db.Category.destroy({
                where: {
                    id: data
                },
            });
            resolve({
                success: true,
                message: "Category delete successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getCategoryDetails = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let categoryData = {};
            categoryData.errMessage = null;
            categoryData.success = false;
            categoryData.category = {};
            const category = await db.Category.findOne({
                where: {
                    id: data
                },
            })
            if (!category) {
                categoryData.errMessage = "Category not found";
            } else {
                categoryData.category = category;
                categoryData.success = true;
            }
            resolve(categoryData);
        } catch (error) {
            reject(error);
        }
    });