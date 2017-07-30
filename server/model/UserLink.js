"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var schema = mongoose.Schema({
    title: String,
    href: String,
    desc: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createAt: { type: Date, "default": Date.now() },
    updateAt: { type: Date, "default": Date.now() }
});
exports.UserLink = mongoose.model('user_link', schema);
