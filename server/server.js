"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var CommonLink_1 = require("./model/CommonLink");
var util_1 = require("./util");
mongoose.connect('mongodb://localhost:6969/susulink', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
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
    console.log(req.body);
    var ri = new util_1.ResInfo();
    var _a = req.body, keywords = _a.keywords, listFlag = _a.listFlag;
    if (listFlag === 'all') {
        var condition = null;
        if (keywords) {
            var regexp = new RegExp(keywords, 'i');
            condition = { $or: [{ title: regexp }, { href: regexp }, { desc: regexp }] };
        }
        else {
            condition = {};
        }
        CommonLink_1.CommonLink.find(condition).then(function (data) {
            ri.set(1, 'success', sortLinks(data, keywords));
            res.json(ri);
        });
    }
    else if (listFlag === 'my') {
        ri.set(1, 'success', [
            { id: '__ssl_myLink_0', title: '百度一下，你就知道', href: 'http://www.baidu.com/', isStar: true, starCount: 9787361, desc: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。百度超过千亿的中文网页数据库，可以瞬间找到相关的搜索结果。' },
            { id: '__ssl_myLink_1', title: 'ECMAScript 6 入门 - 阮一峰', href: 'http://es6.ruanyifeng.com/', isStar: true, starCount: 1238764, desc: '本书覆盖 ES6 与上一个版本 ES5 的所有不同之处，对涉及的语法知识给予详细介绍，并给出大量简洁易懂的示例代码。本书为中级难度，适合已经掌握 ES5 的读者，用来了解这门语言的最新发展；也可当作参考手册，查寻新增的语法点。全书已由电子工业出版社出版，目前是第二版，书名为《ES6 标准入门》，2017年下半年即将推出第三版。纸版是基于网站内容排版印刷的。感谢张春雨编辑支持我将全书开源的做法。如果您认可这本书，建议购买纸版。这样可以使出版社不因出版开源书籍而亏钱，进而鼓励更多的作者开源自己的书籍。下面是第二版的购买地址。' }
        ]);
        res.json(ri);
    }
});
app.post('/api/sign/up', function (req, res) {
    console.log(req.body);
    var ri = new util_1.ResInfo();
    res.json(ri);
});
app.post('/api/sign/in', function (req, res) {
    console.log(req.body);
    var ri = new util_1.ResInfo();
    res.json(ri);
});
app.listen(4201, 'localhost', function () {
    console.log('susulink server start at localhost:4201');
});
