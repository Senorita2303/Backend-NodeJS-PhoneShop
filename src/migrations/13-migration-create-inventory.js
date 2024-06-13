'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Inventories', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: true,
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
            storeBranchId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'StoreBranches',
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
        await queryInterface.dropTable('Inventories');
    }
};