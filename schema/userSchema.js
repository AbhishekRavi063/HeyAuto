// schema/userSchema.js

const { db } = require('../config.js');

const userSchema = {
    name: String,
    number: Number,
    email: String,
    age: Number,
};

const userCollection = db.collection('users');

module.exports = { userSchema, userCollection };
