const db = require('../../../database/repository');
const Result = require('../../../utilities/Result');
const respond = require('../../../utilities/respond');
const composeResult = require('../../../utilities/compose-result');
const ActionRequestQuery = require('../query/ActionRequestQuery');
const ApprovalValidation = require('../validation/validation');
const Route = require('../../../utilities/route');

const rejectRequest = async (req, res) => {
    try {
        const payload = { ...req.body, requestId: req.params.request_id, actionType: 'REJECTED' };
        
        const response = await composeResult(
            async () => db.execute(new ActionRequestQuery(payload)),
            ApprovalValidation.validateAction
        )(payload);

        return respond(response, "REJECTED successfully", "Failed to Reject");
    } catch (error) {
        console.error(error);
        return respond(Result.Error(error.message || "Internal Server Error"), "", "Failed to Reject");
    }
};

Route.withOutSecurity()
    .noAuth()
    .post("/approval/:request_id/reject", rejectRequest)
    .bind();
