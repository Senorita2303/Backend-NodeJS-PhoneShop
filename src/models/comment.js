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
            this.belongsTo(models.User, { foreignKey: "userId" });
            this.belongsTo(models.Product, { foreignKey: "productId" });
            this.belongsTo(models.Comment, {
                as: "ParentComment",
                foreignKey: "parentCommentId",
            });
            this.hasMany(models.Comment, {
                as: "SubComments",
                foreignKey: "parentCommentId",
            });
        }
    }
    Comment.init(
        {
            message: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            sumary: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            imagepath: {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "Comment",
            timestamps: true,
        }
    );
    return Comment;
};