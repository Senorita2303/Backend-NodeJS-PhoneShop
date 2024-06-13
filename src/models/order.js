
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {

        static associate(models) {

            this.hasMany(models.OrderDetail, {
                foreignKey: "orderId",
                as: "orderDetails",
            });

            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: 'user'
            });
            this.belongsTo(models.UserVoucher, {
                foreignKey: "userVoucherId",
                as: 'userVoucher'
            });
            this.belongsTo(models.ShippingService, {
                foreignKey: "shippingServiceId",
                as: "shippingService"
            });
            this.belongsTo(models.OrderStatus, {
                foreignKey: "orderStatusId",
                as: 'orderStatus'
            });
            this.belongsTo(models.Address, {
                foreignKey: "addressId",
                as: "address"
            });
            this.belongsTo(models.Payment, {
                foreignKey: "paymentId",
                as: "payment"
            });
            this.belongsTo(models.StoreBranch, {
                foreignKey: "storeBranchId",
                as: "storeBranch"
            });
        }
    }
    Order.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subTotal: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },     // Tổng tiền hàng
            shippingFee: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },  // Phí vận chuyển
            discount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },     // Giảm giá
            total: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            orderStatusId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            addressId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            paymentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            storeBranchId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            shippingServiceId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            userVoucherId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Order",
            timestamps: true,
        }
    );
    return Order;
};