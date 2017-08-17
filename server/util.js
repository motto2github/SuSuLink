"use strict";
exports.__esModule = true;
var http = require("http");
var https = require("https");
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
    'https://baidu.com/': { title: '百度一下，你就知道', iconUrl: 'https://www.baidu.com/favicon.ico', keywords: '百度搜索', description: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。' },
    'http://www.baidu.com/': { title: '百度一下，你就知道', iconUrl: 'https://www.baidu.com/favicon.ico', keywords: '百度搜索', description: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。' },
    'https://www.baidu.com/': { title: '百度一下，你就知道', iconUrl: 'https://www.baidu.com/favicon.ico', keywords: '百度搜索', description: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。' },
    'http://jd.com/': { title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!' },
    'https://jd.com/': { title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!' },
    'http://www.jd.com/': { title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!' },
    'https://www.jd.com/': { title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!' }
};
var tmp_cache_url_info_kvs = { len: 0 };
var HTMLParser = (function () {
    function HTMLParser() {
    }
    HTMLParser.getInfo = function (url, cb) {
        if (url.charAt(url.length - 1) !== '/')
            url += '/';
        // console.log('url:', url);
        var info = hot_url_info_kvs[url] || tmp_cache_url_info_kvs[url];
        if (info)
            return cb(info);
        // console.log('parse url:', url);
        var protocol = new RegExp('^([^:]+)://', 'i').exec(url)[1];
        // console.log('protocol:', protocol);
        var host = new RegExp('^([^:]+://[^/]+)', 'i').exec(url)[1];
        // console.log('host:', host);
        var res_cb = function (res) {
            // console.log(response.statusMessage);
            var html = '';
            res.on('data', function (d) {
                html += d.toString();
                if (html.indexOf('</head>') !== -1)
                    res.destroy();
            });
            res.on('end', function () {
                // console.log('html:', html);
                var curTagName = '', curAttributes = {}, title = '', iconUrl = '', keywords = '', description = '';
                var iconUrlRelRegExp = new RegExp('^shortcut$|^icon$|^shortcut icon$|^icon shortcut$', 'i');
                var parser = new htmlparser.Parser({
                    onopentag: function (name, attributes) {
                        curTagName = name;
                        curAttributes = attributes;
                        if (curTagName === 'link') {
                            // console.log(curTagName, ':', curAttributes);
                            if (iconUrlRelRegExp.test(curAttributes.rel)) {
                                // console.log('curAttributes:', curAttributes);
                                var href = curAttributes.href;
                                if (new RegExp('^data:image/', 'i').test(href))
                                    return;
                                if (!iconUrl) {
                                    iconUrl = href;
                                }
                                else {
                                    if (new RegExp('.ico$|.ico\\?[^\\?]*$', 'i').test(href)) {
                                        iconUrl = href;
                                    }
                                    else
                                        return;
                                }
                                if (new RegExp('^http', 'i').test(iconUrl))
                                    return;
                                else if (new RegExp('^//', 'i').test(iconUrl)) {
                                    iconUrl = protocol + ':' + iconUrl;
                                }
                                else if (new RegExp('^/', 'i').test(iconUrl)) {
                                    iconUrl = host + iconUrl;
                                }
                                else {
                                    iconUrl = host + '/' + iconUrl;
                                }
                                // console.log('iconUrl:', iconUrl);
                            }
                        }
                        else if (curTagName === 'meta') {
                            var name_1 = curAttributes.name;
                            if (name_1)
                                name_1 = name_1.toLowerCase();
                            if (!title && name_1 === 'title') {
                                title = curAttributes.content;
                            }
                            else if (!keywords && name_1 === 'keywords') {
                                keywords = curAttributes.content;
                            }
                            else if (!description && name_1 === 'description') {
                                description = curAttributes.content;
                            }
                        }
                    },
                    ontext: function (text) {
                        if (!title && curTagName === 'title') {
                            title = text;
                        }
                    },
                    onend: function () {
                        if (iconUrl === '')
                            iconUrl = host + '/favicon.ico';
                        tmp_cache_url_info_kvs[url] = { title: title, iconUrl: iconUrl, keywords: keywords, description: description };
                        tmp_cache_url_info_kvs.len++;
                        // console.log('tmp_cache_url_info_kvs:', tmp_cache_url_info_kvs);
                        cb(tmp_cache_url_info_kvs[url]);
                    }
                });
                parser.write(html);
                parser.end();
            });
        };
        if (protocol === 'http') {
            http.get(url, res_cb).on('error', function (e) {
                console.log("error: " + e.message);
                cb(null);
            });
        }
        else if (protocol === 'https') {
            https.get(url, res_cb).on('error', function (e) {
                console.log("error: " + e.message);
                cb(null);
            });
        }
        else {
            cb(null);
        }
    };
    return HTMLParser;
}());
exports.HTMLParser = HTMLParser;
