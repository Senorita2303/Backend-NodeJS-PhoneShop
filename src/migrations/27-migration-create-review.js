'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reviews', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            message: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            rating: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            productId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Reviews');
    }
};