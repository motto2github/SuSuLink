"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var schema = mongoose.Schema({
    title: String,
    href: String,
    summary: String,
    iconUrl: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createAt: { type: Date, "default": function () { return Date.now(); } },
    updateAt: { type: Date, "default": function () { return Date.now(); } }
});
exports.UserLink = mongoose.model('user_link', schema);
