"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ShippingService extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Order, {
                foreignKey: "shippingServiceId",
                as: "orders",
            });
        }
    }
    ShippingService.init(
        {
            courier: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            serviceName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ShippingService",
            timestamps: true,
        }
    );
    return ShippingService;
};