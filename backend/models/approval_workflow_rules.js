'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class approval_workflow_rules extends Model {
        static associate(models) {
            approval_workflow_rules.belongsTo(models.approval_workflows, {
                foreignKey: 'workflow_id',
                as: 'workflow'
            });

            approval_workflow_rules.hasMany(models.approval_levels, {
                foreignKey: 'rule_id',
                as: 'levels'
            });
        }
    }

    approval_workflow_rules.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        workflow_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        condition_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        condition_value: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        approval_required: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'approval_workflow_rules',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_workflow_rules_workflow_id',
                fields: ['workflow_id']
            }
        ]
    });

    return approval_workflow_rules;
};