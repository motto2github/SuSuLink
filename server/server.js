"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var CommonLink_1 = require("./model/CommonLink");
var util_1 = require("./util");
var User_1 = require("./model/User");
var UserLink_1 = require("./model/UserLink");
mongoose.connect('mongodb://localhost:6969/susulink', function (err) {
    if (err)
        return console.error(err);
    console.log('db connect success, at mongodb://localhost:6969/susulink');
});
/*let sortLinks = (links, keywords) => {
 let regexp = new RegExp(keywords, 'i');
 links.sort((a, b): number => {
 if (keywords) {
 let a_title_test = regexp.test(a.title), a_href_test = regexp.test(a.href), a_desc_test = regexp.test(a.desc);
 let b_title_test = regexp.test(b.title), b_href_test = regexp.test(b.href), b_desc_test = regexp.test(b.desc);
 if (a_title_test && !b_title_test) return -1;
 if (!a_title_test && b_title_test) return 1;
 if (a_href_test && !b_href_test) return -1;
 if (!a_href_test && b_href_test) return 1;
 if (a_desc_test && !b_desc_test) return -1;
 if (!a_desc_test && b_desc_test) return 1;
 }
 if (a.starCount >= b.starCount) return -1;
 return 1;
 })
 return links;
 };*/
var app = express();
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json());
app.post('/api/common-link/list', function (req, res) {
    var ri = new util_1.ResInfo();
    var keywords = req.body.keywords;
    var condition = null;
    if (keywords) {
        var regexp = new RegExp(keywords, 'i');
        condition = { $or: [{ title: regexp }, { href: regexp }, { desc: regexp }] };
    }
    else
        condition = {};
    CommonLink_1.CommonLink.find(condition).sort({ starCount: -1, title: 1 }).exec(function (err, links) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        return res.json(ri.set(1, 'success', { links: links }));
    });
});
app.post('/api/user-link/list', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, keywords = _a.keywords, curUserId = _a.curUserId;
    if (!curUserId)
        return res.json(ri.set(-88, '请求参数异常'));
    User_1.User.findOne({ _id: curUserId }, { _id: true }, function (err, user) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!user)
            return res.json(ri.set(-88, '请求参数异常'));
        var condition = null;
        if (keywords) {
            var regexp = new RegExp(keywords, 'i');
            condition = { owner: curUserId, $or: [{ title: regexp }, { href: regexp }, { summary: regexp }] };
        }
        else
            condition = { owner: curUserId };
        UserLink_1.UserLink.find(condition).sort({ starCount: -1, title: 1 }).exec(function (err, links) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试', { errMsg: err.message }));
            res.json(ri.set(1, 'success', { links: links }));
        });
    });
});
/*app.post('/api/links', (req, res) => {
 let ri = new ResInfo();
 let {keywords, listFlag, curUserId} = req.body;
 let condition = null;
 if (keywords) {
 let regexp = new RegExp(keywords, 'i');
 condition = {$or: [{title: regexp}, {href: regexp}, {desc: regexp}]};
 } else condition = {};
 if (listFlag === 'common-link') {
 CommonLink.find(condition).sort({title: 1}).exec((err, links) => {
 if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
 return res.json(ri.set(1, 'success', {links}));
 });
 } else if (listFlag === 'user-link') {
 if (!curUserId) return res.json(ri.set(-88, '请求参数异常'));
 User.findOne({_id: curUserId}, {_id: true}, (err, user) => {
 if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
 if (!user) return res.json(ri.set(-88, '请求参数异常'));
 condition.owner = curUserId;
 UserLink.find(condition).exec((err, links) => {
 if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试', {errMsg: err.message}));
 res.json(ri.set(1, 'success', {links}));
 });
 });
 }
 });*/
app.post('/api/sign-up', function (req, res) {
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
app.post('/api/sign-in', function (req, res) {
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
app.post('/api/user-link/add', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, title = _a.title, href = _a.href, summary = _a.summary, curUserId = _a.curUserId;
    if (!title || !href || !curUserId)
        return res.json(ri.set(-88, '请求参数异常'));
    User_1.User.findOne({ _id: curUserId }, { _id: true }, function (err, user) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!user)
            return res.json(ri.set(-88, '请求参数异常'));
        new UserLink_1.UserLink({ title: title, href: href, summary: summary, owner: curUserId }).save(function (err) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            return res.json(ri.set(1, '添加成功'));
        });
    });
});
app.post('/api/user-link/remove', function (req, res) {
    var ri = new util_1.ResInfo();
    var id = req.body.id;
    if (!id)
        return res.json(ri.set(-88, '请求参数异常'));
    UserLink_1.UserLink.remove({ _id: id }, function (err) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        return res.json(ri.set(1, '删除成功'));
    });
});
app.post('/api/user-link/update', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, _id = _a._id, title = _a.title, href = _a.href, summary = _a.summary, owner = _a.owner;
    if (!_id || !owner || !title || !href)
        return res.json(ri.set(-88, '请求参数异常'));
    UserLink_1.UserLink.findOne({ _id: _id, owner: owner }, function (err, link) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!link)
            return res.json(ri.set(-88, '请求参数异常'));
        link.title = title;
        link.href = href;
        link.summary = summary;
        link.save(function (err) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            return res.json(ri.set(1, '修改成功'));
        });
    });
});
app.post('/api/user-link/findOne', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, id = _a.id, userId = _a.userId;
    if (!id || !userId)
        return res.json(ri.set(-88, '请求参数异常'));
    UserLink_1.UserLink.findOne({ _id: id, owner: userId }).exec(function (err, link) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!link)
            return res.json(ri.set(-88, '请求参数异常'));
        return res.json(ri.set(1, '查找成功', { link: link }));
    });
});
app.post('/api/common-link/star', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, id = _a.id, userId = _a.userId;
    if (!id || !userId)
        return res.json(ri.set(-88, '请求参数异常'));
    User_1.User.findOne({ _id: userId }, { _id: true }).exec(function (err, user) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!user)
            return res.json(ri.set(-88, '请求参数异常'));
        CommonLink_1.CommonLink.findOne({ _id: id }, { starCount: true, starUsers: true }).exec(function (err, link) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            if (!link)
                return res.json(ri.set(-88, '请求参数异常'));
            link.starCount++;
            link.starUsers.push(userId);
            link.save(function (err) {
                if (err)
                    return res.json(ri.set(-99, '数据库异常，请稍后重试'));
                return res.json(ri.set(1, '操作成功'));
            });
        });
    });
});
app.post('/api/common-link/unstar', function (req, res) {
    var ri = new util_1.ResInfo();
    var _a = req.body, id = _a.id, userId = _a.userId;
    if (!id || !userId)
        return res.json(ri.set(-88, '请求参数异常'));
    CommonLink_1.CommonLink.findOne({ _id: id }, { starCount: true, starUsers: true }).exec(function (err, link) {
        if (err)
            return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        if (!link || link.starUsers.indexOf(userId) === -1)
            return res.json(ri.set(-88, '请求参数异常'));
        link.starUsers.pull(userId);
        link.starCount--;
        link.save(function (err) {
            if (err)
                return res.json(ri.set(-99, '数据库异常，请稍后重试'));
            return res.json(ri.set(1, '操作成功'));
        });
    });
});
app.listen(4201, 'localhost', function () {
    console.log('susulink server start at localhost:4201');
});
