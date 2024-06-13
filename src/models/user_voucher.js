"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserVoucher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user"
            });
            this.belongsTo(models.Voucher, {
                foreignKey: "voucherId",
                as: "voucher"
            });
            this.hasMany(models.Order, {
                foreignKey: "userVoucherId",
                as: "orders"
            });
        }
    }
    UserVoucher.init(
        {
            isUsed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            voucherId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "UserVoucher",
            timestamps: true,
        }
    );
    return UserVoucher;
};