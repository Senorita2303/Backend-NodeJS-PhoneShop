"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {

        static associate(models) {
            // Product
            this.hasMany(models.Product, {
                foreignKey: "brandId",
                as: "brand",
            });
        }
    }
    Brand.init(
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
            desc: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            headQuarters: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            order: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            countProduct: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            image: {
                type: DataTypes.STRING,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Brand",
            timestamps: true,
        }
    );
    return Brand;
};