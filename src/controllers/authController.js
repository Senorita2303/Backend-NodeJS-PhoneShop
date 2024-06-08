// const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
// const otpGenerator = require('otp-generator');
// const User = require("~/models/userModel.js");
// const otp = require("~/templatesmail/otp");
// const ErrorHandler = require("~/utils/errorHandler.js")
// const sendEmail = require("~/utils/sendEmail.js");
// const mailService = require('~/utils/mailer');
import { env } from '~/config/environment';
const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
export const register = async (req, res) => {
  try {
    const fileData = req.file;
    const response = await services.register(req.body, fileData);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

export const sendOTP = async (req, res) => {
  try {
    const response = await services.sendOTP(req.body);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const response = await services.verifyOTP(req.body);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.cookie("access_token", response.accessToken, {
      expires: new Date(
        Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    }).status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

export const login = async (req, res) => {
  try {
    const response = await services.login(req.body);
    return res.cookie("access_token", response.accessToken, {
      expires: new Date(
        Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    }).status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("access_token", null, {
      expires: new Date(Date.now()), // expires curent
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    }).status(StatusCodes.OK).json({});
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};


export const loginSuccess = async (req, res) => {
  try {
    const response = await services.loginSuccess(req.body);
    return res.cookie("access_token", response.accessToken, {
      expires: new Date(
        Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    }).status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const response = await services.forgotPassword(req);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

export const resetPassword = async (req, res) => {
  try {
    const response = await services.resetPassword(req.params, req.body);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};