"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PaymentMethod extends Model {

        static associate(models) {
            this.hasMany(models.Payment, {
                foreignKey: "paymentMethodId",
                as: "payments",
            });
        }
    }
    PaymentMethod.init(
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
            modelName: "PaymentMethod",
            timestamps: true,
        }
    );
    return PaymentMethod;
};