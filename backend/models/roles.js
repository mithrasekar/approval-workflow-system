'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class roles extends Model {
        static associate(models) {
            roles.hasMany(models.users, {
                foreignKey: 'role_id',
                as: 'users'
            });
        }
    }

    roles.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return roles;
};
