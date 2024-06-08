const CryptoJS = require('crypto-js');
const qs = require('qs');
import { format } from 'date-fns';
const moment = require('moment');
const db = require("~/models");
import { env } from '~/config/environment';
const axios = require('axios').default;

export const createZaloPayOrder = (apiUrl, clientUrl, orderId, orderPayAmount) =>
    new Promise(async (resolve, reject) => {
        try {
            const embed_data = {
                redirecturl: `${clientUrl}/order-success/${orderId}`,
            };
            const items = [{}];

            const order = {
                app_id: env.ZALO_APP_ID,
                app_trans_id: `${moment().format('YYMMDD')}_${orderId}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
                app_user: 'user123',
                app_time: Date.now(), // miliseconds
                item: JSON.stringify(items),
                embed_data: JSON.stringify(embed_data),
                amount: orderPayAmount,
                callback_url: `${apiUrl}/api/payment/zalopay/callback`,
                description: `Payment for the order #${orderId}`,
                bank_code: "",
            };
            // appid|app_trans_id|appuser|amount|apptime|embeddata|item
            const data = env.ZALO_APP_ID + '|' + order.app_trans_id + '|' + order.app_user + '|' + order.amount + '|' + order.app_time + '|' + order.embed_data + '|' + order.item;
            order.mac = CryptoJS.HmacSHA256(data, env.ZALO_KEY1).toString();
            const result = await axios.post("https://sb-openapi.zalopay.vn/v2/create", null, { params: order });
            resolve({
                paymentUrl: result?.data?.order_url
            });
        } catch (error) {
            reject(error);
        }
    });
