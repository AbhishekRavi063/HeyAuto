// schema/cabSchema.js

const { db } = require('../config');

const cabSchema = {
    name: String,
    number: Number,
    address: String,
    photo: String,     // Store the image URL in the database
    vehicleNo: Number,
    gender: String,
    age: Number,
    active:Boolean,
    lisence: String,
    location: String,   // Store the lisence URL in the databaseE
};

const cabCollection = db.collection('cabs');

module.exports = { cabSchema, cabCollection };
