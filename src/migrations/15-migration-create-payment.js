'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Payments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            paymentMethodId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'PaymentMethods',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            paymentStatusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'PaymentStatuses',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            desc: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            paidDate: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.dropTable('Payments');
    }
};