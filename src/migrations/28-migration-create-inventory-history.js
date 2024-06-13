'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('InventoryHistories', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            status: {
                type: Sequelize.ENUM("in", "out"),
                allowNull: true,
            },
            reference: {
                type: Sequelize.STRING,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            currentStock: {
                type: Sequelize.INTEGER,
            },
            inventoryId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Inventories',
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
        await queryInterface.dropTable('InventoryHistories');
    }
};