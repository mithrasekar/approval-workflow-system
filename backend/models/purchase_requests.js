'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class purchase_requests extends Model {
        static associate(models) {
            purchase_requests.belongsTo(models.users, {
                foreignKey: 'created_by',
                as: 'creator'
            });
        }
    }

    purchase_requests.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        pr_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        customer_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'PENDING' // Can be PENDING, APPROVED, REJECTED
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'purchase_requests',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return purchase_requests;
};
