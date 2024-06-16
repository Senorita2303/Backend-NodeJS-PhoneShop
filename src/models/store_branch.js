"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class StoreBranch extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Order, {
                foreignKey: "storeBranchId",
                as: "orders"
            });
            // define association here
            // Store_Branch.hasMany(models.Admin, {
            //     foreignKey: {
            //         name: "id_branch",
            //     },
            // });
            this.hasMany(models.Inventory, {
                foreignKey: "storeBranchId",
                as: "inventories"
            });
        }
    }
    StoreBranch.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
            },
            branchName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            district: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            districtId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            province: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            provinceId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "StoreBranch",
            timestamps: true,
        }
    );
    return StoreBranch;
};