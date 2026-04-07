const Result = require('./Result');

const composeResult = (queryExecution, validationFn) => {
    return async (payload) => {
        if (validationFn) {
            const validationResult = await Promise.resolve(validationFn(payload));
            if (validationResult && !validationResult.isSuccess) {
                return validationResult; // Result.Error
            }
        }
        
        try {
            const data = await queryExecution();
            return Result.Ok(data);
        } catch (error) {
            return Result.Error(error.message);
        }
    };
};

module.exports = composeResult;
