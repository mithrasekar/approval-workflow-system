'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_levels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'approval_workflow_rules',
          key: 'id'
        }
      },
      level_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      approver_type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      approver_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      approver_role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      is_mandatory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('approval_levels', {
      fields: ['rule_id', 'level_no'],
      type: 'unique',
      name: 'uniq_rule_level'
    });

    await queryInterface.addConstraint('approval_levels', {
      type: 'check',
      name: 'chk_approver_type',
      where: {
        [Sequelize.Op.or]: [
          {
            approver_type: 'USER',
            approver_user_id: { [Sequelize.Op.ne]: null },
            approver_role_id: null
          },
          {
            approver_type: 'ROLE',
            approver_role_id: { [Sequelize.Op.ne]: null },
            approver_user_id: null
          }
        ]
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('approval_levels');
  }
};