const db = require('../../../database/repository');
const Result = require('../../../utilities/Result');
const respond = require('../../../utilities/respond');
const composeResult = require('../../../utilities/compose-result');
const GetAllUsersQuery = require('../query/GetAllUsersQuery');
const Route = require('../../../utilities/route');

const getAllUsers = async (req, res) => {
    try {
        const response = await composeResult(
            async () => db.findAll(new GetAllUsersQuery())
        )(req.query);

        return respond(response, "Users fetched successfully", "Failed to fetch users");
    } catch (error) {
        console.error(error);
        return respond(Result.Error("Internal Server Error"), "", "Failed to fetch users");
    }
};

Route.withOutSecurity()
    .noAuth()
    .get("/admin/users", getAllUsers)
    .bind();
