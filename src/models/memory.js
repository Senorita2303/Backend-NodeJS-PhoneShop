"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Memory extends Model {

        static associate(models) {
            // Product
            this.hasMany(models.Product, {
                foreignKey: "memoryId",
                as: "productsVariants",
            });
        }
    }
    Memory.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            ram: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            rom: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            chipset: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "Memory",
            timestamps: true,
        }
    );
    return Memory;
};