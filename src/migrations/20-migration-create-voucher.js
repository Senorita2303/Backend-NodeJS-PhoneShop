'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Vouchers', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            voucherType: {
                type: Sequelize.ENUM("product", "total purchase", "shipping", "referral code"),
            },
            voucherKind: {
                type: Sequelize.ENUM("percentage", "amount"),
            },
            voucherValue: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            maxDiscount: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null,
            },
            minPurchaseAmount: {
                type: Sequelize.INTEGER,
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.dropTable('Vouchers');
    }
};