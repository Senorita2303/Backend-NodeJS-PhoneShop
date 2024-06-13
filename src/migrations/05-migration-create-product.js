'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            desc: {
                type: Sequelize.TEXT,
                defaultValue: null
            },
            video: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            thumbUrl: {
                type: Sequelize.STRING,
                defaultValue: null
            },
            views: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            isOutOfStock: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: true
            },
            discountPercentage: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            basePrice: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            warrantyPeriod: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            brandId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Brands',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Categories',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    }
};