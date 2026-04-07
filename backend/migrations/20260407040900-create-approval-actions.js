'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_actions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      approval_request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'approval_requests',
          key: 'id'
        }
      },
      level_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      action: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      action_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      remarks: {
        type: Sequelize.TEXT
      },
      action_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('approval_actions', {
      fields: ['approval_request_id', 'level_no'],
      type: 'unique',
      name: 'uniq_action_level'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('approval_actions');
  }
};