"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var CommonLink_1 = require("./model/CommonLink");
var util_1 = require("./util");
var User_1 = require("./model/User");
var Link_1 = require("./model/Link");
mongoose.connect('mongodb://localhost:6969/susulink', function (err) {
    if (err)
        return console.error(err);
    console.log('db connect success, at mongodb://localhost:6969/susulink');
});
var sortLinks = function (links, keywords) {
    var regexp = new RegExp(keywords, 'i');
    links.sort(function (a, b) {
        if (keywords) {
            var a_title_test = regexp.test(a.title), a_href_test = regexp.test(a.href), a_desc_test = regexp.test(a.desc);
            var b_title_test = regexp.test(b.title), b_href_test = regexp.test(b.href), b_desc_test = regexp.test(b.desc);
            if (a_title_test && !b_title_test)
                return -1;
            if (!a_title_test && b_title_test)
                return 1;
            if (a_href_test && !b_href_test)
                return -1;
            if (!a_href_test && b_href_test)
                return 1;
            if (a_desc_test && !b_desc_test)
                return -1;
            if (!a_desc_test && b_desc_test)
                return 1;
        }
        if (a.starCount >= b.starCount)
            return -1;
        return 1;
    });
    return links;
};
var app = express();
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json());
app.post('/api/links', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, keywords = _a.keywords, listFlag = _a.listFlag, curUserId = _a.curUserId;
    var condition = null;
    if (keywords) {
        var regexp = new RegExp(keywords, 'i');
        condition = { $or: [{ title: regexp }, { href: regexp }, { desc: regexp }] };
    }
    else
        condition = {};
    if (listFlag === 'all') {
        CommonLink_1.CommonLink.find(condition, function (err, links) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            return res.json(ri.set(1, 'success', { links: sortLinks(links, keywords) }));
        });
    }
    else if (listFlag === 'my') {
        if (!curUserId)
            return res.json(ri.set(-88, '请求参数异常'));
        User_1.User.findOne({ _id: curUserId }, { _id: true }, function (err, user) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            if (!user)
                return res.json(ri.set(-88, '请求参数异常'));
            condition.starUser = curUserId;
            Link_1.Link.find(condition, {}, function (err, links) {
                if (err)
                    return res.json(ri.set(-99, '数据库异常，请稍后重试', { errMsg: err.message }));
                res.json(ri.set(1, 'success', { links: links }));
            });
        });
    }
});
app.post('/api/sign/up', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, name = _a.name, password = _a.password;
    if (!name || !password)
        return res.json(ri.set(-88, '请求参数异常'));
    User_1.User.findOne({ name: name }, { _id: true }, function (err, user) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (user)
            return res.json(ri.set(-1, '该用户名已被注册'));
        new User_1.User({ name: name, password: password }).save(function (err) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            return res.json(ri.set(1, '注册成功'));
        });
    });
});
app.post('/api/sign/in', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, name = _a.name, password = _a.password;
    if (!name || !password)
        return res.json(ri.set(-88, '请求参数异常'));
    User_1.User.findOne({ name: name, password: password }, { _id: true, name: true }, function (err, user) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!user)
            return res.json(ri.set(-1, '账号或密码错误'));
        return res.json(ri.set(1, '登录成功', { user: user }));
    });
});
app.post('/api/link/add', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, title = _a.title, href = _a.href, desc = _a.desc, curUserId = _a.curUserId;
    if (!title || !href || !curUserId)
        return res.json(ri.set(-88, '请求参数异常'));
    User_1.User.findOne({ _id: curUserId }, { _id: true }, function (err, user) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!user)
            return res.json(ri.set(-88, '请求参数异常'));
        new Link_1.Link({ title: title, href: href, desc: desc, starUser: curUserId }).save(function (err) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            return res.json(ri.set(1, '添加成功'));
        });
    });
});
app.listen(4201, '192.168.0.104', function () {
    console.log('susulink server start at 192.168.0.104:4201');
});
