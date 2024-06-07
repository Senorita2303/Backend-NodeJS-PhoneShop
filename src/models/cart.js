
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {

        static associate(models) {
            // ProductVariant
            this.belongsTo(models.ProductVariant, {
                foreignKey: "productVariantId",
                as: "productVariant",
            });

            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: 'user'
            })
        }
    }
    Cart.init(
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
            productVariantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Cart",
            timestamps: true,
        }
    );
    return Cart;
};