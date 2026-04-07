const db = require('../../../database/repository');
const Result = require('../../../utilities/Result');
const respond = require('../../../utilities/respond');
const composeResult = require('../../../utilities/compose-result');
const GetPendingApprovalsQuery = require('../query/GetPendingApprovalsQuery');
const ApprovalValidation = require('../validation/validation');
const Route = require('../../../utilities/route');

const getPendingApprovals = async (req, res) => {
    try {
        const response = await composeResult(
            async () => db.findAll(new GetPendingApprovalsQuery(req.query.user_id)),
            ApprovalValidation.validateGetPending
        )(req.query);

        return respond(response, "Pending Approvals Fetched", "Failed to Fetch");
    } catch (error) {
        console.error(error);
        return respond(Result.Error("Internal Server Error"), "", "Failed to Fetch");
    }
};

Route.withOutSecurity()
    .noAuth()
    .get("/approval/pending", getPendingApprovals)
    .bind();
