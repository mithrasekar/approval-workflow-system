const isPositive = (value) => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
};
module.exports = isPositive;
