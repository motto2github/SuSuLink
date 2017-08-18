"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var schema = mongoose.Schema({
    title: String,
    href: String,
    summary: String,
    iconUrl: String,
    starUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    sortNumber: Number,
    createAt: { type: Date, "default": Date.now() },
    updateAt: { type: Date, "default": Date.now() }
});
exports.CommonLink = mongoose.model('common_link', schema);
