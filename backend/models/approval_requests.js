'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class approval_requests extends Model {
        static associate(models) {
            approval_requests.belongsTo(models.approval_workflows, {
                foreignKey: 'workflow_id',
                as: 'workflow'
            });

            approval_requests.belongsTo(models.users, {
                foreignKey: 'created_by',
                as: 'creator'
            });

            approval_requests.hasMany(models.approval_request_steps, {
                foreignKey: 'approval_request_id',
                as: 'steps'
            });

            approval_requests.hasMany(models.approval_actions, {
                foreignKey: 'approval_request_id',
                as: 'actions'
            });
        }
    }

    approval_requests.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        entity_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        entity_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        workflow_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        current_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'PENDING'
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'approval_requests',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_approval_requests_workflow_id',
                fields: ['workflow_id']
            }
        ]
    });

    return approval_requests;
};