'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProductImages', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            },
            imageUrl: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            originalName: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            },
            fileSize: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            productVariantId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'ProductVariants',
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
        await queryInterface.dropTable('ProductImages');
    }
};