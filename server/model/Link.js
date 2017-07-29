"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var schema = mongoose.Schema({
    title: String,
    href: String,
    desc: String,
    starUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createAt: { type: Date, "default": Date.now() },
    updateAt: { type: Date, "default": Date.now() }
});
exports.Link = mongoose.model('link', schema);
