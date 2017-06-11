const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Generic Route

// GET: localhost:3000/api
// -----------------------
router.get('/', (req, res, next) => {
   return res.status(200).json({
       message: "The API is working!"
   })
});


// User Authentication Routes
//
// POST: localhost:3000/api/user/sign-up
// -------------------------------------

router.get('/user/sign-up', (req, res, next) => {
    return res.json({
        message: 'HEy'
    });
});

router.post('/user/sign-up', (req, res, next) => {
    let newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    // Check if email already exists
    User.findOne({email: req.body.email})
        .then((user) => {
            console.log(user);
            // If user with email was found, return a message stating tha
            if (user === null || user === undefined) {

                // If no user with the request email was found,
                // save the requested user to the database (SIGN UP)
                newUser.save()
                    .then((user) => {
                        return res.status(201).json({
                            message: 'User was successfully created.',
                            obj: user
                        })
                    })
                    .catch((err) => res.status(500).json({
                        title: 'An error occurred in signing up',
                        error: err
                    }));

            } else {
                return res.status(401).json({
                    message: 'User with that email address already exists'
                });
            }

        })
        .catch(err => res.json({ error: err }));

});

// POST: localhost:3000/api/user/sign-in
// -------------------------------------
router.post('/user/sign-in', (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            // If the user doesn't exist, return an error
            // message to the client-end
            if (!user) {
                return res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid email or password'}
                });
            }

            // If the user's password doesn't match the
            // password in the db, send an error message
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({
                    title: 'Login failed',
                    error: {message: 'Invalid email or password.'}
                });
            }

            // On Success: Create token and respond with success message
            let token = jwt.sign({user: user}, 'secret', {expiresIn: 8000});

            res.status(200).json({
                message: 'Successfully logged in!',
                token: token,
                userId: user._id
            });

        })
        .catch(err => res.status(500).json({
            title: 'An error occurred',
            error: err
        }));
});

module.exports = router;