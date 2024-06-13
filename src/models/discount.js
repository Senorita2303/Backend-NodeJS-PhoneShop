"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Discount extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Product, {
                foreignKey: "productId",
                as: "product"
            });
        }
    }
    Discount.init(
        {
            discountType: {
                type: DataTypes.ENUM("percentage", "amount", "buy one get one"),
                allowNull: false,
            },
            discountValue: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Discount",
            timestamps: true,
        }
    );
    return Discount;
};