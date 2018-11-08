var db = require("../db");

// Define the schema
var activities = new db.Schema({
    loc:           { type: [Number], index: '2dsphere'},
    uvExposure: Number,
    speed: Number,
    submitTime: { type: Date, default: Date.now }
});

// Creates a Devices (plural) collection in the db using the fitData schema
var Activities = db.model("Activities", activities);

module.exports = Activities;

