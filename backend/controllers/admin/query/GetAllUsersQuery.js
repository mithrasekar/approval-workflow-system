const db = require('../../../models');

module.exports = class GetAllUsersQuery {
    constructor() {}

    async get() {
        const { Op } = db.Sequelize;
        const users = await db.users.findAll({
            include: [{
                model: db.roles,
                as: 'role',
                required: true,
                attributes: ['role_name'],
                where: {
                    role_name: { [Op.ne]: 'ADMIN' }
                }
            }],
            attributes: ['id', 'name', 'email', 'phone', 'is_active', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        return users;
    }
}
