'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            sumary: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            imagepath: {
                type: Sequelize.TEXT,
                allowNull: true,
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
            parentCommentId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Comments',
                    key: "id"
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
        await queryInterface.dropTable('Comments');
    }
};