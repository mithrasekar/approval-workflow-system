'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin1234', salt);

    // 1. Roles
    await queryInterface.bulkInsert('roles', [
      { id: 1, role_name: 'SALES_EXEC', is_active: true, created_at: new Date(), updated_at: new Date() },
      { id: 2, role_name: 'MANAGER', is_active: true, created_at: new Date(), updated_at: new Date() },
      { id: 3, role_name: 'ADMIN', is_active: true, created_at: new Date(), updated_at: new Date() }
    ], {});

    // 2. Users - ISquare Branding
    await queryInterface.bulkInsert('users', [
      { id: 101, name: 'Kavya (Sales Exec)', email: 'kavya@isquare.com', phone: '9876543211', password: hashedPassword, role_id: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
      { id: 102, name: 'Mithra (Manager)', email: 'mithra@isquare.com', phone: '9876543210', password: hashedPassword, role_id: 2, is_active: true, created_at: new Date(), updated_at: new Date() },
      { id: 103, name: 'Janani (Manager)', email: 'janani@isquare.com', phone: '9876543212', password: hashedPassword, role_id: 2, is_active: true, created_at: new Date(), updated_at: new Date() },
      { id: 104, name: 'Admin User', email: 'admin@isquare.com', phone: '9876543213', password: adminPassword, role_id: 3, is_active: true, created_at: new Date(), updated_at: new Date() }
    ], {});

    // 3. Approval Workflows
    await queryInterface.bulkInsert('approval_workflows', [
      { id: 1, entity_type: 'PR', action: 'CREATE', approval_required: true, auto_publish: false, is_active: true, created_at: new Date(), updated_at: new Date() }
    ], {});

    // 4. Approval Workflow Rules
    await queryInterface.bulkInsert('approval_workflow_rules', [
      { id: 1, workflow_id: 1, condition_type: 'ROLE', condition_value: 'SALES_EXEC', approval_required: true, created_at: new Date(), updated_at: new Date() },
      { id: 2, workflow_id: 1, condition_type: 'ROLE', condition_value: 'MANAGER', approval_required: false, created_at: new Date(), updated_at: new Date() }
    ], {});

    // 5. Create Levels for SALES_EXEC (Rule 1)
    await queryInterface.bulkInsert('approval_levels', [
      {
        rule_id: 1,
        level_no: 1,
        approver_type: 'ROLE',
        approver_role_id: 2, // Any Manager
        is_mandatory: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        rule_id: 1,
        level_no: 2,
        approver_type: 'ROLE',
        approver_role_id: 2, // Any Manager (Janani/Mithra)
        is_mandatory: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('approval_levels', null, {});
    await queryInterface.bulkDelete('approval_workflow_rules', null, {});
    await queryInterface.bulkDelete('approval_workflows', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
