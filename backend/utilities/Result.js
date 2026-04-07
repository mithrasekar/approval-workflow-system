class Result {
    constructor(isSuccess, value, error) {
        this.isSuccess = isSuccess;
        this.value = value;
        this.error = error;
    }
    static Ok(value) { return new Result(true, value, null); }
    static Error(error) { return new Result(false, null, error); }
    matchWith({ Ok, Error }) {
        if (this.isSuccess) {
            return Ok({ value: this.value });
        } else {
            return Error({ value: this.error });
        }
    }
}
module.exports = Result;
