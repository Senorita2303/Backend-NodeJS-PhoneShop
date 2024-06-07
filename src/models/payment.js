"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {

        static associate(models) {
            this.hasMany(models.Order, {
                foreignKey: "paymentId",
                as: "orders",
            });
            this.belongsTo(models.PaymentStatus, {
                foreignKey: "paymentStatusId",
                as: "paymentStatus"
            });
            this.belongsTo(models.PaymentMethod, {
                foreignKey: "paymentMethodId",
                as: "paymentMethod"
            })
        }
    }
    Payment.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            desc: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            paidDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            paymentMethodId: {
                type: DataTypes.INTEGER,
                allowNull: false,

            },
            paymentStatusId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Payment",
            timestamps: true,
        }
    );
    return Payment;
};