const db = require('../../../database/repository');
const Result = require('../../../utilities/Result');
const respond = require('../../../utilities/respond');
const composeResult = require('../../../utilities/compose-result');
const FetchPRsQuery = require('../query/FetchPRsQuery');
const PRValidation = require('../validation/validation');
const Route = require('../../../utilities/route');

const listPRs = async (req, res) => {
    try {
        const response = await composeResult(
            async () => db.findAll(new FetchPRsQuery(req.query)),
            PRValidation.validateList
        )(req.query);

        return respond(response, "Purchase Requests Fetched", "Failed to Fetch PRs");
    } catch (error) {
        console.error(error);
        return respond(Result.Error("Internal Server Error"), "", "Failed to Fetch PRs");
    }
};

Route.withOutSecurity()
    .noAuth()
    .get("/pr/list", listPRs)
    .bind();
