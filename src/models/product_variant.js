"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductVariant extends Model {

        static associate(models) {
            // Product
            this.belongsTo(models.Product, {
                foreignKey: "productId",
                as: "product",
            });
            this.belongsTo(models.Memory, {
                foreignKey: "memoryId",
                as: "memory",
            });
            this.belongsTo(models.Color, {
                foreignKey: "colorId",
                as: "color",
            });
            this.hasMany(models.ProductImage, {
                foreignKey: 'productVariantId',
                as: 'images'
            });
            this.hasMany(models.Cart, {
                foreignKey: 'productVariantId',
                as: "carts"
            })
        }
    }
    ProductVariant.init(
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
            sku: {
                type: DataTypes.STRING,
                defaultValue: null
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            sold: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            marketPrice: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            colorId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            memoryId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ProductVariant",
            timestamps: true,
        }
    );
    return ProductVariant;
};