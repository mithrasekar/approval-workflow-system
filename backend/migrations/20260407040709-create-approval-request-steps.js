'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_request_steps', {
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
      approver_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'PENDING'
      },
      action_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('approval_request_steps', {
      fields: ['approval_request_id', 'level_no'],
      type: 'unique',
      name: 'uniq_request_level'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('approval_request_steps');
  }
};