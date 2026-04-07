const db = require('../../../models');
const ApprovalService = require('../../../services/ApprovalService');

module.exports = class ActionRequestQuery {
    constructor(payload) {
        this.payload = payload;
    }

    async execute() {
        const { requestId, user_id, actionType, remarks } = this.payload;
        return await ApprovalService.actionRequest(requestId, user_id, actionType, remarks);
    }
}