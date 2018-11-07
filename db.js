var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/db", { useNewUrlParser: true });

module.exports = mongoose;
