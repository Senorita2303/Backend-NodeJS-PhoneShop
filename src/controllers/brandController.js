const { StatusCodes } = require('http-status-codes')
const services = require("~/services");

// >>>>>>>>>>>>>>>>>>>>> createBrand Admin route  >>>>>>>>>>>>>>>>>>>>>>>>
export const createBrand = async (req, res) => {
    try {
        const fileData = req.file;
        const response = await services.createBrand(req.body, fileData);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> get all brand >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const getAllBrands = async (req, res) => {
    try {
        const response = await services.getAllBrands();
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
};

//>>>>>>>>>>>>>>>>>> Update Admin Route >>>>>>>>>>>>>>>>>>>>>>>
export const updateBrand = async (req, res) => {
    try {
        const fileData = req.file;
        const response = await services.updateBrand(req, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // let brand = await BrandModel.findById(req.params.id);

    // if (!brand) {
    //     return next(new ErrorHandler("Brand not found", 404));
    // }
    // if (req.body.image.includes("base64")) {
    //     const imageId = brand.image.public_id;
    //     // delete old Image from cloudnairy
    //     await cloudinary.v2.uploader.destroy(imageId);
    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    //         folder: "Brand", // this folder cloudainry data base manage by us
    //         width: 150,
    //         crop: "scale",
    //     });
    //     req.body.image = {
    //         public_id: myCloud.public_id, // id for img
    //         url: myCloud.secure_url, // url for img
    //     }

    //     brand = await BrandModel.findByIdAndUpdate(req.params.id, req.body, {
    //         new: true,
    //         runValidators: true,
    //         useFindAndModify: false,
    //     });
    // } else {
    //     brand = await BrandModel.findByIdAndUpdate(req.params.id,
    //         {
    //             name: req.body.name,
    //             desc: req.body.desc,
    //             isHide: req.body.isHide,
    //             country: req.body.country,
    //             headQuarters: req.body.headQuarters
    //         }, {
    //         new: true,
    //         runValidators: true,
    //         useFindAndModify: false,
    //     });
    // }
    // res.status(201).json({
    //     success: true,
    //     brand: brand,
    // });
};


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  delete brand --admin  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const deleteBrand = async (req, res) => {
    try {
        const response = await services.deleteBrand(req.params.id);
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // const brand = await BrandModel.findByIdAndDelete(req.params.id);

    // if (!brand) {
    //     return next(new ErrorHandler("Brand not found", 404));
    // }
    // // Deleting Images From Cloudinary
    // const imageId = brand.image.public_id;
    // await cloudinary.v2.uploader.destroy(imageId);

    // res.status(201).json({
    //     success: true,
    //     message: "Brand delete successfully",
    // });
};

//>>>>>>>>>>>>>>>>>>>>>>> Detils of brand >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const getBrandDetails = async (req, res) => {
    try {
        const response = await services.getBrandDetails(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Lỗi server",
            status: StatusCodes.BAD_REQUEST
        })
    }
    // const id = req.params.id;
    // const brand = await BrandModel.findById(id);
    // if (!brand) {
    //     return next(new ErrorHandler("Brand not found", 404));
    // }
    // res.status(200).json({
    //     succes: true,
    //     brand
    // });
};
