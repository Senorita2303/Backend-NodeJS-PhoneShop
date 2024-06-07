// const CategoryModel = require("~/models/categoryModel");
// const ErrorHandler = require("~/utils/errorHandler");
// const asyncWrapper = require("~/middlewares/asyncWrapper");
// const ApiFeatures = require("~/utils/apiFeatures");
// const cloudinary = require("cloudinary");
const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// >>>>>>>>>>>>>>>>>>>>> createCategory Admin route  >>>>>>>>>>>>>>>>>>>>>>>>
export const createCategory = async (req, res) => {
    try {
        const fileData = req.file;
        const response = await services.createCategory(req.body, fileData);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // const { name, desc, headQuarters, country, image, isHide } = req.body;
    // const myCloud = await cloudinary.v2.uploader.upload(image, {
    //     folder: "Category", // this folder cloudainry data base manage by us
    //     width: 150,
    //     crop: "scale",
    // });

    // const category = await CategoryModel.create({
    //     name,
    //     desc,
    //     headQuarters,
    //     country,
    //     image: {
    //         public_id: myCloud.public_id,
    //         url: myCloud.secure_url,
    //     },
    //     isHide,
    //     createdBy: req.user.id,
    // });

    // res.status(201).json({
    //     success: true,
    //     category,
    // });
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> get all category admin route>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const getAllCategories = async (req, res) => {
    try {
        const response = await services.getAllCategories();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // const categories = await CategoryModel.find();
    // res.status(201).json({
    //     success: true,
    //     categories: categories,
    // });
};


//>>>>>>>>>>>>>>>>>> Update Admin Route >>>>>>>>>>>>>>>>>>>>>>>
export const updateCategory = async (req, res) => {
    try {
        const fileData = req.file;
        const response = await services.updateCategory(req, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // let category = await CategoryModel.findById(req.params.id);

    // if (!category) {
    //     return next(new ErrorHandler("Category not found", 404));
    // }
    // if (req.body.image.includes("base64")) {
    //     const imageId = category.image.public_id;
    //     // delete old Image from cloudnairy
    //     await cloudinary.v2.uploader.destroy(imageId);
    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //         folder: "Category", // this folder cloudainry data base manage by us
    //         width: 150,
    //         crop: "scale",
    //     });
    //     req.body.image = {
    //         public_id: myCloud.public_id, // id for img
    //         url: myCloud.secure_url, // url for img
    //     }

    //     category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
    //         new: true,
    //         runValidators: true,
    //         useFindAndModify: false,
    //     });
    // } else {
    //     category = await CategoryModel.findByIdAndUpdate(req.params.id,
    //         {
    //             name: req.body.name,
    //             desc: req.body.desc,
    //             isHide: req.body.isHide
    //         }, {
    //         new: true,
    //         runValidators: true,
    //         useFindAndModify: false,
    //     });
    // }
    // res.status(201).json({
    //     success: true,
    //     category: category,
    // });
};


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  delete category --admin  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const deleteCategory = async (req, res) => {
    try {
        const response = await services.deleteCategory(req.params.id);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // const category = await CategoryModel.findByIdAndDelete(req.params.id);

    // if (!category) {
    //     return next(new ErrorHandler("Category not found", 404));
    // }
    // // Deleting Images From Cloudinary
    // const imageId = category.image.public_id;
    // await cloudinary.v2.uploader.destroy(imageId);

    // res.status(201).json({
    //     success: true,
    //     message: "Category delete successfully",
    // });
};

//>>>>>>>>>>>>>>>>>>>>>>> Detils of category >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const getCategoryDetails = async (req, res) => {
    try {
        const response = await services.getCategoryDetails(req.params.id);
        return res.status(StatusCodes.OK).json(response);

    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // const id = req.params.id;
    // const category = await CategoryModel.findById(id);
    // if (!category) {
    //     return next(new ErrorHandler("Category not found", 404));
    // }
    // res.status(200).json({
    //     succes: true,
    //     category
    // });
};
