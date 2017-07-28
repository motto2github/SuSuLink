"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var schema = mongoose.Schema({
    name: { type: String, unique: true },
    password: String,
    createAt: { type: Date, "default": Date.now },
    updateAt: { type: Date, "default": Date.now }
});
exports.User = mongoose.model('user', schema);
