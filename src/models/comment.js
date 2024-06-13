"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: "userId",
                as: "user",
            });
            this.belongsTo(models.Product, {
                foreignKey: "productId",
                as: "product",
            });
            this.belongsTo(models.Comment, {
                foreignKey: "parentCommentId",
                as: "parentComment",
            });
        }
    }
    Comment.init(
        {
            message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            sumary: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            imagepath: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            parentCommentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Comment",
            timestamps: true,
        }
    );
    return Comment;
};