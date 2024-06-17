// const orderModel = require("~/models/orderModel");
// const productModel = require("~/models/productModel");
// const ErrorHandler = require("~/utils/errorHandler");
const { StatusCodes } = require('http-status-codes')
const services = require("~/services");
// Create a order 
export const createOrder = async (req, res) => {
  try {
    const response = await services.createOrder(req);
    if (response.clientUrl) {
      res.redirect(`${response.clientUrl}/order-success/${response.orderId}`);
    }
    else
      return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Get single order 
export const getSingleOrder = async (req, res) => {
  try {
    const response = await services.getSingleOrder(req.params);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // const order = await orderModel
  //   .findById(req.params.id)
  //   .populate({ path: "user", select: "name email" });
  // if (!order) {
  //   return next(new ErrorHandler("Order not found with this Id", 404));
  // }

  // res.status(200).json({
  //   success: true,
  //   order,
  // });
};

// Get admin single order 
export const getAdminSingleOrder = async (req, res) => {
  try {
    console.log('vailon');
    const response = await services.getAdminSingleOrder(req.params);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
};

// Get all orders for user
export const myOrders = async (req, res) => {
  try {
    const response = await services.myOrders(req);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // const userOrders = await orderModel.find({ user: req.user._id }); // this id from authentictaion user.req

  // res.status(200).json({
  //   success: true,
  //   userOrders,
  // });
};

// Get all orders -- Admin
export const getAllOrders = async (req, res) => {
  try {
    const response = await services.getAllOrders();
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // const orders = await orderModel.find();
  // let totalAmount = 0;
  // // count total price of all order for dashbord
  // orders.forEach((order) => {
  //   totalAmount += order.totalPrice;
  // });
  // res.status(200).json({
  //   success: true,
  //   totalAmount,
  //   orders,
  // });
};

// Update order status -- Admin
export const updateOrder = async (req, res) => {
  try {
    const response = await services.updateOrder(req);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // const order = await orderModel.findById(req.params.id);
  // if (!order) {
  //   return next(new ErrorHandler("Order not found with this id", 400));
  // }
  // if (order.orderStatus === "Delivered") {
  //   return next(new ErrorHandler("You have already delivered this order", 400));
  // }
  // // when orderd is shipped and need to update order status to deliverd then. pass order id updateStock function and also pass quantity of the product
  // // orderItems is the array of object in orderSchema with {name , productId , quantity , phoneNo .. so on}propoerty
  // if (req.body.status === "Shipped") {
  //   order.orderItems.forEach(async (orderItem) => {
  //     await updateStock(orderItem.productId, orderItem.quantity);
  //   });
  // }
  // // once order quantity is reduced in productModel then update status as oredrStatus well
  // order.orderStatus = req.body.status;
  // // now also set delivery time once order Delivered:
  // if (order.orderStatus === "Delivered") {
  //   order.deliveredAt = Date.now();
  // }
  // // save to DataBase
  // await order.save({ validateBeforeSave: false });
  // res.status(200).json({
  //   success: true,
  // });
};

// // Update status function with productId and quantity params
// async function updateStock(id, quantity) {
//   try {
//     const product = await productModel.findById(id);
//     if (!product) {
//       throw new ErrorHandler("Product not found", 404);
//     }
//     // Update the stock of the product using the order quantity
//     product.Stock -= quantity;
//     await product.save({ validateBeforeSave: false });
//   } catch (error) {
//     throw new ErrorHandler("Product not found", 404);
//   }
// }

// Delete Order -- Admin 
export const deleteOrder = async (req, res, next) => {
  try {
    const response = await services.deleteOrder(req);
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Lỗi server",
      status: StatusCodes.BAD_REQUEST
    })
  }
  // const order = await orderModel.findById(req.params.id);

  // if (!order) {
  //   return next(new ErrorHandler("Order not found with given Id", 400));
  // }

  // await order.remove();

  // res.status(200).json({
  //   success: true,
  //   message: "Order deleted successfully",
  // });
};
