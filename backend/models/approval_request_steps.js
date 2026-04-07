'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class approval_request_steps extends Model {
        static associate(models) {
            approval_request_steps.belongsTo(models.approval_requests, {
                foreignKey: 'approval_request_id',
                as: 'request'
            });

            approval_request_steps.belongsTo(models.users, {
                foreignKey: 'approver_user_id',
                as: 'approver'
            });
        }
    }

    approval_request_steps.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        approval_request_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        level_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        approver_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(30),
            defaultValue: 'PENDING'
        },
        action_at: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'approval_request_steps',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_steps_approval_request_id',
                fields: ['approval_request_id']
            },
            {
                name: 'idx_steps_approver_user_id',
                fields: ['approver_user_id']
            }
        ]
    });

    return approval_request_steps;
};