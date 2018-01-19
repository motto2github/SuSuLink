"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var proxy = require("http-proxy-middleware");
var app = express();
app.use('/api', proxy({
    target: 'http://47.92.135.213:8008',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/susulink-service'
    }
}));
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('**', function (req, res) {
    res.redirect('/');
});
// 阿里云主机内网IP：172.26.74.127
app.listen(4201, function () {
    console.log('susulink server start at localhost:4201');
});
