"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class InventoryHistory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Inventory, {
                foreignKey: "inventoryId",
                as: "inventory"
            });
        }
    }
    InventoryHistory.init(
        {
            status: {
                type: DataTypes.ENUM("in", "out"),
                allowNull: true,
            },
            reference: {
                type: DataTypes.STRING,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            currentStock: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: "InventoryHistory",
            timestamps: true
        }
    );
    return InventoryHistory;
};