"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Inventory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Discount, {
                foreignKey: "inventoryId",
                as: "discounts",
            });
            this.hasMany(models.Voucher, {
                foreignKey: "inventoryId",
                as: "vouchers",
            });
            this.hasMany(models.InventoryHistory, {
                foreignKey: "inventoryId",
                as: "inventoryHistories",
            });
            this.belongsTo(models.StoreBranch, {
                foreignKey: "storeBranchId",
                as: "storeBranch"
            });
            this.belongsTo(models.ProductVariant, {
                foreignKey: "productVariantId",
                as: "productVariant"
            });
            this.hasMany(models.Cart, {
                foreignKey: "inventoryId",
                as: "carts"
            });
            this.hasMany(models.OrderDetail, {
                foreignKey: "inventoryId",
                as: "orderDetails",
            });
        }
    }
    Inventory.init(
        {
            stock: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Inventory",
            timestamps: true
        }
    );
    return Inventory;
};