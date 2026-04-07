'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('approval_workflow_rules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workflow_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'approval_workflows',
          key: 'id'
        }
      },
      condition_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      condition_value: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      approval_required: {
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

    await queryInterface.addConstraint('approval_workflow_rules', {
      fields: ['workflow_id', 'condition_type', 'condition_value'],
      type: 'unique',
      name: 'uniq_workflow_condition'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('approval_workflow_rules');
  }
};