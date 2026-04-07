const db = require('../../../database/repository');
const Result = require('../../../utilities/Result');
const respond = require('../../../utilities/respond');
const composeResult = require('../../../utilities/compose-result');
const CreatePRQuery = require('../query/CreatePRQuery');
const PRValidation = require('../validation/validation');
const Route = require('../../../utilities/route');

const createPR = async (req, res) => {
    try {
        const response = await composeResult(
            async () => db.execute(new CreatePRQuery(req.body)),
            PRValidation.validateCreate
        )(req.body);

        return respond(response, "Purchase Request Created", "Failed to Create PR");
    } catch (error) {
        console.error(error);
        return respond(Result.Error("Internal Server Error"), "", "Failed to Create PR");
    }
};

Route.withOutSecurity()
    .noAuth()
    .post("/pr", createPR)
    .bind();
