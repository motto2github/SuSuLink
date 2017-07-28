"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var schema = mongoose.Schema({
    title: String,
    href: String,
    desc: String,
    starCount: Number,
    createAt: { type: Date, "default": Date.now },
    updateAt: { type: Date, "default": Date.now }
});
exports.CommonLink = mongoose.model('common_link', schema);
