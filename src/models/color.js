"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Color extends Model {

        static associate(models) {
            // Product
            this.hasMany(models.Product, {
                foreignKey: "colorId",
                as: "productVariants",
            });
        }
    }
    Color.init(
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
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            }
        },
        {
            sequelize,
            modelName: "Color",
            timestamps: true,
        }
    );
    return Color;
};