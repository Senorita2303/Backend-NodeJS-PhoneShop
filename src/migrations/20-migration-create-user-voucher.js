'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserVouchers', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            isUsed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
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
            voucherId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Vouchers',
                    key: 'id',
                },
                onDelete: "set null",
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
        await queryInterface.dropTable('UserVouchers');
    }
};