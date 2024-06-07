// const asyncWrapper = require("~/middlewares/asyncWrapper");
// const { User } = require("~/models");
// const sendJWtToken = require("~/utils/JwtToken");
// const sendEmail = require("~/utils/sendEmail");
// const crypto = require("crypto");
// const cloudinary = require("cloudinary");
// const bcryptjs = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const ErrorHandler = require("~/utils/errorHandler");
// import { env } from '~/config/environment';
const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
import { env } from '~/config/environment';
// Get user detail
export const getUserDetails = async (req, res) => {
  try {
    const response = await services.getUserDetails(req.user.id);
    return res.cookie("access_token", response.accessToken, {
      expires: new Date(
        Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }).status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }

  // const user = await userModel.findById(req.user.id); // user.id because we set that user into as user.req when user gose autentiction. becauae all data of users set into req.user. only user when logged in then access this function
  // sendJWtToken(user, 200, res);
};

// Update user password
export const updatePassword = async (req, res, next) => {
  try {
    const response = await services.updatePassword(req);
    return res.cookie("access_token", response.accessToken, {
      expires: new Date(
        Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }).status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const fileData = req.file;
    const response = await services.updateProfile(req, fileData);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // // object with user new data
  // const newUserData = {
  //   name: req.body.name
  // };

  // // if avatar not empty then
  // if (req.body.avatar !== "") {
  //   const user = await userModel.findById(req.user.id);
  //   const imageId = user.avatar.public_id;

  //   //  await cloudinary.v2.uploader.destroy(imageId); // delete old Image from cloudnairy
  //   await cloudinary.v2.uploader.destroy(imageId);

  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "Avatar", // this folder cloudainry data base manage by us
  //     width: 150,
  //     crop: "scale",
  //   });

  //   newUserData.avatar = {
  //     public_id: myCloud.public_id, // id for img
  //     url: myCloud.secure_url, // new User data
  //   };
  // }

  // // set new value of user
  // const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
  //   new: true,
  //   runValidators: true,
  //   useFindAndModify: false,
  // });

  // await user.save();
  // res.status(200).json({
  //   success: true,
  //   user,
  // });
};

// Get single user (admin) Access only
export const getSingleUser = async (req, res) => {
  try {
    const response = await services.getSingleUser(req.params.id);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Update User Role -- Admin (may admin can change any user to admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const response = await services.updateUserRole(req.body);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // // add set new role of user
  // const newUserData = {
  //   name: req.body.name,
  //   email: req.body.email,
  //   role: req.body.role,
  // };
  // await userModel.findByIdAndUpdate(req.params.id, newUserData, {
  //   new: true,
  //   runValidators: true,
  //   useFindAndModify: false,
  // });

  // res.status(200).json({
  //   success: true,
  // });
};

// Delete user -- Admin(only admin can delete user)
export const deleteUser = async (req, res, next) => {
  try {
    const response = await services.deleteUser(req.body);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // const user = await userModel.findById(req.params.id);
  // // when no user found with that id
  // if (!user) {
  //   return next(
  //     new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
  //   );
  // }

  // // delete iamge from cloud as well
  // const imageId = user.avatar.public_id;
  // await cloudinary.v2.uploader.destroy(imageId);

  // // if user founded the just remove from database
  // await user.remove();

  // res.status(200).json({
  //   success: true,
  //   message: "User Deleted Successfully",
  // });
};

// Get all user admin
export const getAllUser = async (req, res) => {
  try {
    const response = await services.getAllUser();
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // const users = await userModel.find();

  // res.status(201).json({
  //   success: true,
  //   users: users,
  // });
};

//google login
// exports.google = asyncWrapper(async (req, res, next) => {
//   const { name, email, avatar } = req.body;
//   try {
//     const user = await userModel.findOne({ email });
//     if (user) {
//       sendJWtToken(user, 200, res);
//     } else {
//       const generatedPassword =
//         Math.random().toString(36).slice(-8) +
//         Math.random().toString(36).slice(-8);
//       const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
//       const myCloud = await cloudinary.v2.uploader.upload(avatar, {
//         folder: "Avatar", // this folder cloudainry data base manage by us
//         width: 150,
//         crop: "scale",
//       });
//       const newUser = new userModel({
//         name:
//           name.toLowerCase().split(' ').join('') +
//           Math.random().toString(9).slice(-4),
//         password: hashedPassword,
//         email,
//         avatar: {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         },
//       });
//       await newUser.save();
//       sendJWtToken(newUser, 200, res);
//     }
//   } catch (error) {
//     next(error);
//   }
// });
