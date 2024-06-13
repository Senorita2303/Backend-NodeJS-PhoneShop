
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Address extends Model {

        static associate(models) {
            this.hasMany(models.Order, {
                foreignKey: "addressId",
                as: "orders"
            });
            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user"
            });
        }
    }
    Address.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            district: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ward: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            houseNumber: {
                type: DataTypes.STRING,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Address",
            timestamps: true,
        }
    );
    return Address;
};