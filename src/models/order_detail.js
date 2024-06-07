
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {

        static associate(models) {
            // ProductVariant
            this.belongsTo(models.ProductVariant, {
                foreignKey: "productVariantId",
                as: "productVariant",
            });

            this.belongsTo(models.Order, {
                foreignKey: "orderId",
                as: 'order'
            })
        }
    }
    OrderDetail.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productVariantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "OrderDetail",
            timestamps: true,
        }
    );
    return OrderDetail;
};