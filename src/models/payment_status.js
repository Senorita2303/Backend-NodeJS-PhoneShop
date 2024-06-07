"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PaymentStatus extends Model {

        static associate(models) {
            this.hasMany(models.Payment, {
                foreignKey: "paymentStatusId",
                as: "payments",
            });
        }
    }
    PaymentStatus.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: "PaymentStatus",
            timestamps: true,
        }
    );
    return PaymentStatus;
};