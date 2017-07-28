import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import {CommonLink} from "./model/CommonLink";
import {ResInfo} from "./util";
import {User} from "./model/User";

mongoose.connect('mongodb://localhost:6969/susulink', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  console.log('db connect success, at mongodb://localhost:6969/susulink');
});

let sortLinks = (links, keywords) => {
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
};

let app = express();

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());

app.post('/api/links', (req, res) => {
  let ri = new ResInfo();
  let {keywords, listFlag} = req.body;
  if (listFlag === 'all') {
    let condition = null;
    if (keywords) {
      let regexp = new RegExp(keywords, 'i');
      condition = {$or: [{title: regexp}, {href: regexp}, {desc: regexp}]};
    } else {
      condition = {};
    }
    CommonLink.find(condition, (err, commonLinks) => {
      if (err) res.json(ri.set(-99, '数据库异常，请稍后重试'));
      else res.json(ri.set(1, 'success', sortLinks(commonLinks, keywords)));
    });
  } else if (listFlag === 'my') {
    res.json(ri.set(1, 'success', [
      {id: '__ssl_myLink_0', title: '百度一下，你就知道', href: 'http://www.baidu.com/', isStar: true, starCount: 9787361, desc: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。百度超过千亿的中文网页数据库，可以瞬间找到相关的搜索结果。'}
      , {id: '__ssl_myLink_1', title: 'ECMAScript 6 入门 - 阮一峰', href: 'http://es6.ruanyifeng.com/', isStar: true, starCount: 1238764, desc: '本书覆盖 ES6 与上一个版本 ES5 的所有不同之处，对涉及的语法知识给予详细介绍，并给出大量简洁易懂的示例代码。本书为中级难度，适合已经掌握 ES5 的读者，用来了解这门语言的最新发展；也可当作参考手册，查寻新增的语法点。全书已由电子工业出版社出版，目前是第二版，书名为《ES6 标准入门》，2017年下半年即将推出第三版。纸版是基于网站内容排版印刷的。感谢张春雨编辑支持我将全书开源的做法。如果您认可这本书，建议购买纸版。这样可以使出版社不因出版开源书籍而亏钱，进而鼓励更多的作者开源自己的书籍。下面是第二版的购买地址。'}
    ]));
  }
});

app.post('/api/sign/up', (req, res) => {
  let ri = new ResInfo();
  let {name, password} = req.body;
  if (!name || !password) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({name}, {_id: true}, (err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (user) return res.json(ri.set(-1, '该用户名已被注册'));
    new User({name, password}).save((err) => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      return res.json(ri.set(1, '注册成功'));
    });
  });
});

app.post('/api/sign/in', (req, res) => {
  let ri = new ResInfo();
  let {name, password} = req.body;
  if (!name || !password) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({name, password}, {_id: true, name: true}, (err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-1, '账号或密码错误'));
    return res.json(ri.set(1, '登录成功', {user}));
  });
});

app.listen(4201, 'localhost', () => {
  console.log('susulink server start at localhost:4201');
});

