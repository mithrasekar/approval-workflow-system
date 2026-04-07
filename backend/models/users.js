'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
            users.belongsTo(models.roles, {
                foreignKey: 'role_id',
                as: 'role'
            });

            users.hasMany(models.approval_requests, {
                foreignKey: 'created_by',
                as: 'requests'
            });

            users.hasMany(models.approval_request_steps, {
                foreignKey: 'approver_user_id',
                as: 'steps'
            });

            users.hasMany(models.approval_actions, {
                foreignKey: 'action_by',
                as: 'actions'
            });

            users.hasMany(models.approval_levels, {
                foreignKey: 'approver_user_id',
                as: 'approvalLevels'
            });
        }
    }

    users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING(255),
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active: DataTypes.BOOLEAN,
        role_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return users;
};