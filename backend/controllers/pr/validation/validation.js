const validate = require('../../../utilities/validate');
const notEmpty = require('../../../utilities/not-empty');
const isPositive = require('../../../utilities/is-positive');

const createPrRule = {
    pr_number: [[notEmpty, "pr_number is Mandatory!"]],
    customer_name: [[notEmpty, "customer_name is Mandatory!"]],
    product_name: [[notEmpty, "product_name is Mandatory!"]],
    quantity: [[notEmpty, "quantity is Mandatory!"], [isPositive, "quantity cannot be negative!"]],
    unit_price: [[notEmpty, "unit_price is Mandatory!"], [isPositive, "unit_price cannot be negative!"]],
    total_price: [[notEmpty, "total_price is Mandatory!"], [isPositive, "total_price cannot be negative!"]],
    created_by: [[notEmpty, "created_by is Mandatory!"]]
};

const isPositiveInteger = (value) => {
    if (value === undefined || value === null || value === '') return true;
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
};

const listPrRule = {
    page: [[isPositiveInteger, "page must be a positive integer"]],
    limit: [[isPositiveInteger, "limit must be a positive integer"]]
};

module.exports.validateCreate = async (data) => validate(createPrRule, data);
module.exports.validateList = async (data) => validate(listPrRule, data);
