'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Markdown.belongsTo(models.Product, {
                foreignKey: 'productId'
            })
        }
    };
    Markdown.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        contentHTML: {
            allowNull: true,
            type: DataTypes.TEXT('long'),
        },
        contentMarkdown: {
            allowNull: true,
            type: DataTypes.TEXT('long'),
        },
        description: {
            allowNull: true,
            type: DataTypes.TEXT('long'),
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Markdown',
        timestamps: true
    });
    return Markdown;
};