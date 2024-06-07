const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
// Create product -- admin
export const createProduct = async (req, res) => {
  try {
    const fileData = req.file;
    const response = await services.createProduct(req.body, fileData);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Get all product
export const getAllProducts = async (req, res) => {
  try {
    const response = await services.getAllProducts(req);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Get all product -- admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const response = await services.getAllProductsAdmin();
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Update product -- admin
export const updateProduct = async (req, res) => {
  try {
    const fileData = req.file;
    const response = await services.updateProduct(req, fileData);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};


// Delete product -- admin
export const deleteProduct = async (req, res) => {
  try {
    const response = await services.deleteProduct(req.params.id);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Details of product
export const getProductDetails = async (req, res) => {
  try {
    const response = await services.getProductDetails(req.params.id);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};