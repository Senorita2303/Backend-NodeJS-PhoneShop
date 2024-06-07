"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderStatus extends Model {

        static associate(models) {
            this.hasMany(models.Order, {
                foreignKey: "orderStatusId",
                as: "orders",
            });
        }
    }
    OrderStatus.init(
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
            modelName: "OrderStatus",
            timestamps: true,
        }
    );
    return OrderStatus;
};