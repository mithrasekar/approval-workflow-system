const db = require('../../../models');

module.exports = class FetchPRsQuery {
    constructor(options = {}) {
        this.page = Math.max(1, parseInt(options.page, 10) || 1);
        this.limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 10));
    }

    async get() {
        const offset = (this.page - 1) * this.limit;
        const { count, rows } = await db.purchase_requests.findAndCountAll({
            include: [{ model: db.users, as: 'creator' }],
            order: [['created_at', 'DESC']],
            limit: this.limit,
            offset
        });

        return {
            items: rows,
            page: this.page,
            limit: this.limit,
            total: count,
            totalPages: Math.ceil(count / this.limit)
        };
    }
}