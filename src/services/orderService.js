const db = require("~/models/index");
const services = require("~/services");
import { env } from '~/config/environment';
export const createOrder = (req) =>
    new Promise(async (resolve, reject) => {
        try {
            const userId = req.user.id;
            const { isReceiveAtStore, name, phone, email, street, ward, district, province, store } = JSON.parse(req.body.orderInfo);
            const allItems = JSON.parse(req.body.allItems);
            const paymentMethodName = req.body.paymentMethod;
            let total = req.body.total;
            let subTotal = req.body.subTotal;
            let discount = req.body.discount;
            let shipping = req.body.shipping;
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
            await db.Cart.destroy({
                where: {
                    userId: userId
                }
            });
            let response = '';
            const clientUrl = req.body?.clientUrl || req.headers.origin;
            if (paymentMethodName === "Thanh toán qua ví VNPAY") {
                // const apiUrl = `${req.protocol}://${req.get('host')}`;
                const apiUrl = `${req.protocol}://${req.get('host')}`;
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
                const apiUrl = `${req.protocol}://${req.get('host')}`;
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
            reject(error);
        }
    });

export const getSingleOrder = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { orderId } = data;
            const order = await db.Order.findAll({
                where: {
                    id: orderId
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
            reject(error);
        }
    });