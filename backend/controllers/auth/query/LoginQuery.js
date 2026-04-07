const db = require('../../../models');
const bcrypt = require('bcryptjs');

module.exports = class LoginQuery {
    constructor(payload) {
        this.payload = payload;
    }

    async execute() {
        const { identity, password } = this.payload;

        // Find user by email or phone
        const { Op } = db.Sequelize;
        const user = await db.users.findOne({
            where: {
                [Op.or]: [
                    { email: identity },
                    { phone: identity }
                ],
                is_active: true
            },
            include: [{ model: db.roles, as: 'role' }]
        });

        if (!user) {
            throw new Error("Invalid email/phone or password");
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email/phone or password");
        }

        return user;
    }
}