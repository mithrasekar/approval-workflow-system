const notEmpty = (value) => {
    return value !== undefined && value !== null && value !== "";
};

module.exports = notEmpty;
