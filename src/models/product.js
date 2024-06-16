"use strict";
const { Model } = require("sequelize");
const slugify = require('slugify');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {

        static associate(models) {
            this.belongsTo(models.Brand, {
                foreignKey: 'brandId',
                as: 'brand',
            });
            this.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'category',
            });
            this.hasOne(models.Markdown, {
                foreignKey: 'productId',
                as: 'markdown'
            });
            this.hasMany(models.ProductSpecification, {
                foreignKey: 'productId',
                as: 'productSpecs'
            });
            this.hasMany(models.ProductVariant, {
                foreignKey: 'productId',
                as: 'productVariants'
            });
            this.hasMany(models.Comment, {
                foreignKey: "productId",
                as: 'comment'
            });
            this.hasMany(models.Review, {
                foreignKey: "productId",
                as: 'review'
            });
        }
    }
    Product.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            desc: {
                type: DataTypes.TEXT,
                defaultValue: null
            },
            video: {
                type: DataTypes.STRING,
                defaultValue: null
            },
            thumbUrl: {
                type: DataTypes.STRING,
                defaultValue: null
            },
            views: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            discountPercentage: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            basePrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            warrantyPeriod: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            brandId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Product",
            timestamps: true,
            hooks: {
                beforeValidate: function (product, options) {
                    product.slug = slugify(product.name, { lower: true });
                }
            }
        }
    );
    return Product;
};