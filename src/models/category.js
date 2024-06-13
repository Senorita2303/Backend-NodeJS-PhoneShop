"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {

        static associate(models) {
            // Product
            this.hasMany(models.Product, {
                foreignKey: "categoryId",
                as: "products",
            });
        }
    }
    Category.init(
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
                defaultValue: null,
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
            modelName: "Category",
            timestamps: true,
        }
    );
    return Category;
};