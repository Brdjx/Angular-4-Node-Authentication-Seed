const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

UserSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', UserSchema);