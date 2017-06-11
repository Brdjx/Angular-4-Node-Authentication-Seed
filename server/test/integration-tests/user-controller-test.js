const assert = require('assert');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../app');

const User = require('../../models/user');

describe('User API Controller', () => {

    let testUser;

    beforeEach(() => {
        // * NOTE
        // ------
        // These users are unhashed because they will be hashed
        // by the server when they are processed by the API
        testUser = new User({
            email: "test@email.com",
            password: "secret"
        });
    });

    it('should POST (sign up) a new user', (done) => {
        request(app)
            .post('/api/user/sign-up')
            .send(testUser)
            .end(() => {
                User.findOne({ email: "test@email.com" })
                    .then((user) => {
                        console.log(user)
                        assert(user.email === "test@email.com");
                        assert(user.password !== "secret");
                        done();
                    })
                    .catch(err => done(err));
            });
    });

    it('should POST (sign-in) one general user by email', (done) => {
        request(app)
            .post('/api/user/sign-in')
            .send(testUser)
            .end(() => {
                User.findOne({ email: "andy@mainstreetapp.co" })
                    .then((generalUser) => {
                        assert(generalUser.email === "andy@mainstreetapp.co");
                        assert(generalUser.firstname === "Andy");
                        assert(generalUser.lastname === "Smith");
                        assert(generalUser.password !== "hero");
                        done();
                    })
                    .catch(err => done(err));;
            });
    });


});