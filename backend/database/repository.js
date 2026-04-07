class Repository {
    async findOne(queryInstance) {
        if (typeof queryInstance.get === 'function') {
            return await queryInstance.get();
        }
        return await queryInstance.execute();
    }
    async findAll(queryInstance) {
         if (typeof queryInstance.get === 'function') {
            return await queryInstance.get();
        }
        return await queryInstance.execute();
    }
    async insert(queryInstance) {
        if (typeof queryInstance.insert === 'function') {
            return await queryInstance.insert();
        }
        return await queryInstance.execute();
    }
    async execute(queryInstance) {
        return await queryInstance.execute();
    }
}

module.exports = new Repository();
