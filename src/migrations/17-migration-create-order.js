'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            userName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            subTotal: {
                type: Sequelize.INTEGER,
                allowNull: true
            },     // Tổng tiền hàng
            shippingFee: {
                type: Sequelize.INTEGER,
                allowNull: true
            },  // Phí vận chuyển
            discount: {
                type: Sequelize.INTEGER,
                allowNull: true
            },     // Giảm giá
            total: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: "set null",
                onUpdate: "cascade",
            },
            orderStatusId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Addresses',
                    key: 'id',
                },
                onDelete: "set null",
                onUpdate: "cascade",
            },
            addressId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Addresses',
                    key: 'id',
                },
                onDelete: "set null",
                onUpdate: "cascade",
            },
            paymentId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Payments',
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
        await queryInterface.dropTable('Orders');
    }
};