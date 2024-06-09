"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, { foreignKey: "userId", as: 'user', });
            this.belongsTo(models.Product, { foreignKey: "productId", as: 'product', });
        }
    }
    Review.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            message: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            rating: {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "Review",
            timestamps: true,
        }
    );
    return Review;
};