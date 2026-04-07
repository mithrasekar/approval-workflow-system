const validate = require('../../../utilities/validate');
const notEmpty = require('../../../utilities/not-empty');

const getPendingRule = {
    user_id: [[notEmpty, "user_id is Mandatory!"]]
};

const actionRule = {
    user_id: [[notEmpty, "user_id is Mandatory!"]]
};

module.exports.validateGetPending = async (data) => validate(getPendingRule, data);
module.exports.validateAction = async (data) => validate(actionRule, data);
