"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Specification extends Model {

        static associate(models) {
            // ProductSpecification
            this.hasMany(models.ProductSpecification);
        }
    }
    Specification.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            specName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            sequelize,
            modelName: "Specification",
            timestamps: true,
        }
    );
    return Specification;
};