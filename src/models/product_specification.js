"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductSpecification extends Model {

        static associate(models) {
            // Product
            this.belongsTo(models.Product, {
                foreignKey: "productId",
                as: "productSpecs"
            });
            this.belongsTo(models.Specification, {
                foreignKey: "specsId",
                as: "specification"
            })
        }
    }
    ProductSpecification.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true
            },
            specValue: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            specsId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "ProductSpecification",
            timestamps: true,
        }
    );
    return ProductSpecification;
};