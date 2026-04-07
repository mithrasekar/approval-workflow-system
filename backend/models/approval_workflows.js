'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class approval_workflows extends Model {
        static associate(models) {
            approval_workflows.hasMany(models.approval_workflow_rules, {
                foreignKey: 'workflow_id',
                as: 'rules'
            });

            approval_workflows.hasMany(models.approval_requests, {
                foreignKey: 'workflow_id',
                as: 'requests'
            });
        }
    }

    approval_workflows.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        entity_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        action: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        approval_required: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        auto_publish: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'approval_workflows',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return approval_workflows;
};