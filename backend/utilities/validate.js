const Result = require('./Result');

const validate = async (rules, data) => {
    // Allows empty rules (no validation needed)
    if (!rules || Object.keys(rules).length === 0) {
        return Result.Ok(data);
    }

    // Process declarative array rules
    for (const key in rules) {
        if (Object.hasOwnProperty.call(rules, key)) {
            const fieldRules = rules[key]; 
            
            for (const rule of fieldRules) {
                const validatorFn = rule[0];
                const errorMessage = rule[1];
                
                const value = data[key];
                const isValid = await validatorFn(value);
                
                if (!isValid) {
                    return Result.Error(errorMessage);
                }
            }
        }
    }
    
    return Result.Ok(data);
};

module.exports = validate;
