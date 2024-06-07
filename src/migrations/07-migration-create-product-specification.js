'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProductSpecifications', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            specValue: {
                type: Sequelize.STRING,
                allowNull: false,
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
            specsId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Specifications',
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
        await queryInterface.dropTable('ProductSpecifications');
    }
};