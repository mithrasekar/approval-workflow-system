const Result = require('./Result');

const respond = (result, successMsg, failMsg) => {
    let responseObj;
    result.matchWith({
        Ok: ({ value }) => {
            responseObj = { statusCode: 200, status: true, message: successMsg, data: value };
        },
        Error: ({ value }) => {
            responseObj = { statusCode: 400, status: false, message: failMsg, error: value };
        }
    });

    return {
        ...responseObj,
        send: (res) => res.status(responseObj.statusCode).json({
            status: responseObj.status,
            message: responseObj.message,
            data: responseObj.data,
            error: responseObj.error
        })
    };
};

module.exports = respond;
