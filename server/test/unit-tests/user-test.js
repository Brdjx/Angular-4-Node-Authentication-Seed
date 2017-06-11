const assert = require('assert');
const bcrypt = require('bcryptjs');

const User = require('../../models/user');


describe('User Model Tests', () => {
    let newUser;

    it('should save (create) a new User', done => {
        newUser = User({
            email: "test@email.com",
            password: bcrypt.hashSync("XXXX", 10)
        });

        newUser.save()
            .then(user => {
                assert(user.email === "test@email.com");
                done();
            })
            .catch(err => done(err));
    });

    it('should find a user with email address of new user', done => {
        User.findOne({ email: newUser.email })
            .then(user => {
                assert(user.email === newUser.email);
                done();
            })
            .catch(err => done(err));
    });

});