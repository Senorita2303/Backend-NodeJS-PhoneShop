
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
            this.belongsTo(models.Inventory, {
                foreignKey: "inventoryId",
                as: 'inventory'
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
            inventoryId: {
                type: DataTypes.INTEGER,
                allowNull: true,
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