const mongoose = require('mongoose');
process.env.NODE_ENV = 'test';

before((done) => {
    mongoose.connect('mongodb://localhost/ng2-node-internal-example-testing');
    mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
            console.warn('Warning', error);
            done();
        });
});

before(done => {
    function clearDB() {
        for (let i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(() => {});
        }
    }

    clearDB(done());
});