'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class approval_actions extends Model {
        static associate(models) {
            approval_actions.belongsTo(models.approval_requests, {
                foreignKey: 'approval_request_id',
                as: 'request'
            });

            approval_actions.belongsTo(models.users, {
                foreignKey: 'action_by',
                as: 'user'
            });
        }
    }

    approval_actions.init({
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
        action: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        action_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        remarks: {
            type: DataTypes.TEXT
        },
        action_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'approval_actions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_actions_approval_request_id',
                fields: ['approval_request_id']
            }
        ]
    });

    return approval_actions;
};