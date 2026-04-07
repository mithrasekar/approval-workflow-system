'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class approval_levels extends Model {
        static associate(models) {
            approval_levels.belongsTo(models.approval_workflow_rules, {
                foreignKey: 'rule_id',
                as: 'rule'
            });

            approval_levels.belongsTo(models.users, {
                foreignKey: 'approver_user_id',
                as: 'user'
            });

            approval_levels.belongsTo(models.roles, {
                foreignKey: 'approver_role_id',
                as: 'role'
            });
        }
    }

    approval_levels.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rule_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        level_no: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        approver_type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        approver_user_id: {
            type: DataTypes.INTEGER
        },
        approver_role_id: {
            type: DataTypes.INTEGER
        },
        is_mandatory: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'approval_levels',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return approval_levels;
};