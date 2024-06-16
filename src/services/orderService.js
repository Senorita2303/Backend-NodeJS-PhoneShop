const db = require("~/models/index");
const services = require("~/services");
import { env } from '~/config/environment';
export const createOrder = (req) =>
    new Promise(async (resolve, reject) => {
        try {
            const userId = req.user.id;
            const { isReceiveAtStore, name, phone, email, street, ward, district, province, store } = JSON.parse(req.body.orderInfo);
            const allItems = JSON.parse(req.body.allItems);
            const voucherApplied = JSON.parse(req.body.voucherApplied);
            const paymentMethodName = req.body.paymentMethod;
            let total = req.body.total;
            let subTotal = req.body.subTotal;
            let discount = req.body.discount;
            let shipping = req.body.shipping;
            if (Object.keys(voucherApplied).length !== 0) {
                let userVoucher = await db.UserVoucher.findOne({
                    where: {
                        userId: userId,
                        voucherId: voucherApplied.id,
                    },
                    raw: false
                });
                if (userVoucher) {
                    userVoucher.isUsed = true;
                    await userVoucher.save();
                } else {
                    await db.UserVoucher.create({
                        userId: userId,
                        voucherId: voucherApplied.id,
                        isUsed: true,
                    });
                };
            }
            let paymentMethod = await db.PaymentMethod.findOne({
                where: {
                    name: paymentMethodName
                },
                raw: true
            });
            let payment = await db.Payment.create({
                paymentMethodId: paymentMethod.id,
                paymentStatusId: 10
            });
            let address = {};
            if (isReceiveAtStore) {
                address = {
                    "province": "?",
                    "district": "?",
                    "ward": "?",
                    "houseNumber": store,
                }
            } else {
                address = {
                    province: province,
                    district: district,
                    ward: ward,
                    houseNumber: street,
                }
            }
            let createAddress = await db.Address.create(address);
            let createOrder = await db.Order.create({
                userId: userId,
                addressId: createAddress.id,
                paymentId: payment.id,
                orderStatusId: 1,
                userName: name,
                phoneNumber: phone,
                subTotal: subTotal,
                shippingFee: shipping,
                discount: discount,
                total: total,
            });
            const orderDetailData = allItems.map(item => ({
                quantity: item.quantity,
                productVariantId: item.productVariantId,
                userId: userId,
                orderId: createOrder.id
            }));
            const createdOrderDetails = await db.OrderDetail.bulkCreate(orderDetailData);
            //clear cart 
            for (const item of allItems) {
                const productVariantId = item.productVariantId;
                const quantity = item.quantity;

                // Fetch the current stock for the productVariantId from the database
                await db.ProductVariant.decrement("stock", {
                    by: quantity,
                    where: {
                        id: productVariantId,
                    }
                });

            }
            await db.Cart.destroy({
                where: {
                    userId: userId
                }
            });
            let response = '';
            const clientUrl = env.FRONTEND_URL;
            if (paymentMethodName === "Thanh toán qua ví VNPAY") {
                // const apiUrl = `${req.protocol}://${req.get('host')}`;
                const apiUrl = env.BACKEND_URL;
                const ipAddr = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
                response = await services.createVnPayOrder(
                    ipAddr,
                    apiUrl,
                    clientUrl,
                    createOrder.id.toString(),
                    total,
                );
            }
            else if (paymentMethodName === "Thanh toán qua ví ZaloPay") {
                const apiUrl = env.BACKEND_URL;
                response = await services.createZaloPayOrder(
                    apiUrl,
                    clientUrl,
                    createOrder.id.toString(),
                    total,
                );
            }
            resolve({
                id: createOrder.id,
                success: true,
                paymentUrl: response.paymentUrl,
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const getSingleOrder = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { id } = data;
            console.log(id);
            const order = await db.Order.findAll({
                where: {
                    id: id
                },
                include: [
                    {
                        model: db.Payment,
                        as: 'payment',
                        attributes: ['id'],
                        include: [
                            { model: db.PaymentMethod, as: 'paymentMethod', attributes: ['name'] },
                            { model: db.PaymentStatus, as: 'paymentStatus', attributes: ['name'] },
                        ]
                    },
                    {
                        model: db.OrderDetail,
                        as: "orderDetails",
                        attributes: ['quantity'],
                        include: [
                            {
                                model: db.ProductVariant,
                                as: 'productVariant',
                                attributes: ['name', 'price'],
                                include: [
                                    { model: db.ProductImage, as: 'images', attributes: ['imageUrl'] },
                                ]
                            },
                        ]
                    },
                    {
                        model: db.Address,
                        as: 'address',
                        attributes: ['houseNumber', 'ward', 'district', 'province'],
                    },
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        attributes: ['name'],
                    },
                ],
                raw: true,
                nest: true
            });
            const uniqueVariants = {};
            const updatedData = [];

            order.forEach(order => {
                const variant = order.orderDetails.productVariant;
                const variantId = variant.id;
                const imageUrl = variant.images.imageUrl;

                if (!uniqueVariants[variantId]) {
                    uniqueVariants[variantId] = imageUrl;
                    variant.images = { imageUrl: imageUrl };
                    updatedData.push(order);
                }
            });
            resolve({
                order: updatedData
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAdminSingleOrder = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { id } = data;
            const order = await db.Order.findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: db.Payment,
                        as: 'payment',
                        attributes: ['id'],
                        include: [
                            { model: db.PaymentMethod, as: 'paymentMethod', attributes: ['name'] },
                            { model: db.PaymentStatus, as: 'paymentStatus', attributes: ['name'] },
                        ]
                    },
                    {
                        model: db.Address,
                        as: 'address',
                        attributes: ['houseNumber', 'ward', 'district', 'province'],
                    },
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        attributes: ['name'],
                    },
                ],
                raw: true,
                nest: true
            });
            const orderStatuses = await db.OrderStatus.findAll({
                attributes: ['id', 'name'],
                raw: true,
            });
            const paymentStatuses = await db.PaymentStatus.findAll({
                attributes: ['id', 'name'],
                raw: true,
            });
            const paymentMethods = await db.PaymentMethod.findAll({
                attributes: ['id', 'name'],
                raw: true,
            });
            order.orderStatuses = orderStatuses
            order.paymentMethods = paymentMethods
            order.paymentStatuses = paymentStatuses
            resolve({
                order: order
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllOrders = () =>
    new Promise(async (resolve, reject) => {
        try {
            const orders = await db.Order.findAll({
                include: [
                    {
                        model: db.Payment,
                        as: 'payment',
                        attributes: ['id'],
                        include: [
                            { model: db.PaymentMethod, as: 'paymentMethod', attributes: ['name'] },
                            { model: db.PaymentStatus, as: 'paymentStatus', attributes: ['name'] },
                        ]
                    },
                    {
                        model: db.Address,
                        as: 'address',
                        attributes: ['houseNumber', 'ward', 'district', 'province'],
                    },
                    {
                        model: db.OrderStatus,
                        as: 'orderStatus',
                        attributes: ['name'],
                    },
                ],
                raw: true,
                nest: true
            });
            resolve({
                orders: orders
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
export const updateOrder = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            let orderData = {};
            orderData.errMessage = null;
            const id = data.params.id;
            const body = data.body;
            let order = await db.Order.findOne({
                where: {
                    id: id,
                },
                include: [
                    { model: db.Payment, as: 'payment', attributes: ['id'] },
                ],
                raw: false,
                nest: true
            });

            if (order) {
                let payment = await db.Payment.findOne({
                    where: {
                        id: order.paymentId,
                    },
                    raw: false,
                });
                if (payment) {
                    payment.paymentStatusId = body.paymentStatus;
                    payment.paymentMethodId = body.paymentMethod;
                    payment.paidDate = new Date();
                    await payment.save();
                    order.orderStatusId = body.orderStatus;
                    await order.save();
                    orderData.success = true;
                    orderData.order = order;
                } else {
                    orderData.errMessage = "Payment in order not found";
                }
            } else {
                orderData.errMessage = "Order not found";
            }
            resolve(orderData);
        } catch (error) {
            reject(error);
        }
    });
