"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Voucher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.UserVoucher, {
                foreignKey: "voucherId",
                as: "userVouchers"
            });
            // Voucher.belongsTo(models.Inventory, {
            //     foreignKey: {
            //         name: "id_inventory",
            //     },
            // });
        }
    }
    Voucher.init(
        {
            voucherType: {
                type: DataTypes.ENUM("product", "total purchase", "shipping", "referral code"),
            },
            voucherKind: {
                type: DataTypes.ENUM("percentage", "amount"),
                // values: ["percentage", "amount"],
            },
            voucherValue: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            maxDiscount: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
            },
            minPurchaseAmount: {
                type: DataTypes.INTEGER,
            },
            // id_inventory: {
            //     type: DataTypes.INTEGER,
            // },
            startDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Voucher",
            timestamps: true,
        }
    );
    return Voucher;
};