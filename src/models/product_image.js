"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {

        static associate(models) {
            this.belongsTo(models.ProductVariant, {
                foreignKey: "productVariantId",
                as: "productVariants",
            });
        }
    }
    ProductImage.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            originalName: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            fileSize: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            productVariantId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ProductImage",
            timestamps: true,
        }
    );
    return ProductImage;
};