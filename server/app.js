// Use ES6 Code
require("babel-register");


// START: App Configuration
// ------------------------

// App Dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// App Process Environment Configuration
// ------------------------------
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/ng2-node-auth-example');
}

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}



// App Middleware & View Engine Configuration
// ------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(cookieParser());


// Server Files
// ------------
// * '/public' file path is for all the node server's static files
//    that are needed such as brand images, favicon, etc.
const publicFilePath = path.join(__dirname, 'public');
app.use('/public', express.static(publicFilePath));

// Request Header Middleware
// -------------------------
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});


// External Routers
// ----------------
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


// END: App Configuration
// --------------------------------------------------------------


app.get('/', (req, res, next) => {
    res.render('index', { layout: false });
});



if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use((err, req, res, next) => {

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {

        }
    });
});


app.listen(3000, () => {
    console.log('Authentication Example API running at localhost:3000');
});

module.exports = app;