"use strict";
exports.__esModule = true;
var http = require("http");
var htmlparser = require("htmlparser2");
var ResInfo = (function () {
    function ResInfo(code, msg, data) {
        if (code === void 0) { code = 0; }
        if (msg === void 0) { msg = 'fail'; }
        if (data === void 0) { data = null; }
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    ResInfo.prototype.set = function (code, msg, data) {
        this.code = code;
        this.msg = msg;
        if (data !== undefined) {
            this.data = data;
        }
        return this;
    };
    return ResInfo;
}());
exports.ResInfo = ResInfo;
var hot_url_info_kvs = {
    'http://baidu.com/': { title: '百度一下，你就知道', iconUrl: 'https://www.baidu.com/favicon.ico', keywords: '百度搜索', description: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。' },
    'http://www.baidu.com/': { title: '百度一下，你就知道', iconUrl: 'https://www.baidu.com/favicon.ico', keywords: '百度搜索', description: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。' },
    'http://jd.com/': { title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!' },
    'http://www.jd.com/': { title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!' }
};
var HTMLParser = (function () {
    function HTMLParser() {
    }
    HTMLParser.getInfo = function (url, cb) {
        if (url.indexOf('https') === 0)
            url = 'http' + url.substring(5);
        if (url.charAt(url.length - 1) !== '/')
            url += '/';
        var info = hot_url_info_kvs[url];
        if (info)
            return cb(info);
        http.get(url, function (response) {
            // console.log(response.statusMessage);
            var html = '';
            response.on('data', function (d) {
                html += d.toString();
                if (html.indexOf('</head>') !== -1)
                    response.destroy();
            });
            response.on('end', function () {
                // console.log('html:', html);
                var curTagName = '', curAttributes = {}, title = '', iconUrl = '', keywords = '', description = '';
                var iconUrlRegExp = new RegExp('shortcut|icon', 'gi');
                var parser = new htmlparser.Parser({
                    onopentag: function (name, attributes) {
                        curTagName = name;
                        curAttributes = attributes;
                    },
                    ontext: function (text) {
                        if (curTagName === 'title' && title === '') {
                            title = text;
                        }
                        if (curTagName === 'link' && iconUrlRegExp.test(curAttributes.rel) && iconUrl === '') {
                            iconUrl = curAttributes.href;
                            if (iconUrl.indexOf('//') === 0) {
                                iconUrl = 'http:' + iconUrl;
                            }
                            else if (iconUrl.indexOf('/') === 0) {
                                iconUrl = new RegExp('(https?://[^/]*)/', 'gi').exec(url)[1] + iconUrl;
                            }
                        }
                        if (curTagName === 'meta' && curAttributes.name === 'keywords' && keywords === '') {
                            keywords = curAttributes.content;
                        }
                        if (curTagName === 'meta' && curAttributes.name === 'description' && description === '') {
                            description = curAttributes.content;
                        }
                    },
                    onend: function () {
                        cb({ title: title, iconUrl: iconUrl, keywords: keywords, description: description });
                    }
                });
                parser.write(html);
                parser.end();
            });
        }).on('error', function (e) {
            console.log("error: " + e.message);
            cb(null);
        });
    };
    return HTMLParser;
}());
exports.HTMLParser = HTMLParser;
