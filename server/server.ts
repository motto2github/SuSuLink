import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import {CommonLink} from "./model/CommonLink";
import {ResInfo} from "./util";
import {User} from "./model/User";
import {UserLink} from "./model/UserLink";

mongoose.connect('mongodb://localhost:6969/susulink', (err) => {
  if (err) return console.error(err);
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

let app = express();

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());

app.post('/api/common-link/list', (req, res) => {
  let ri = new ResInfo();
  let {keywords} = req.body;
  let condition = null;
  if (keywords) {
    let regexp = new RegExp(keywords, 'i');
    condition = {$or: [{title: regexp}, {href: regexp}, {desc: regexp}]};
  } else condition = {};
  CommonLink.find(condition).sort({starCount: -1, title: 1}).exec((err, links) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    return res.json(ri.set(1, 'success', {links}));
  });
});

app.post('/api/user-link/list', (req, res) => {
  let ri = new ResInfo();
  let {keywords, curUserId} = req.body;
  if (!curUserId) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({_id: curUserId}, {_id: true}, (err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-88, '请求参数异常'));
    let condition = null;
    if (keywords) {
      let regexp = new RegExp(keywords, 'i');
      condition = {owner: curUserId, $or: [{title: regexp}, {href: regexp}, {desc: regexp}]};
    } else condition = {owner: curUserId};
    UserLink.find(condition).sort({starCount: -1, title: 1}).exec((err, links) => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试', {errMsg: err.message}));
      res.json(ri.set(1, 'success', {links}));
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

app.post('/api/sign-up', (req, res) => {
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

app.post('/api/sign-in', (req, res) => {
  let ri = new ResInfo();
  let {name, password} = req.body;
  if (!name || !password) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({name, password}, {_id: true, name: true}, (err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-1, '账号或密码错误'));
    return res.json(ri.set(1, '登录成功', {user}));
  });
});

app.post('/api/user-link/add', (req, res) => {
  let ri = new ResInfo();
  let {title, href, desc, curUserId} = req.body;
  if (!title || !href || !curUserId) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({_id: curUserId}, {_id: true}, (err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-88, '请求参数异常'));
    new UserLink({title, href, desc, owner: curUserId}).save(err => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      return res.json(ri.set(1, '添加成功'));
    });
  });
});

app.post('/api/user-link/remove', (req, res) => {
  let ri = new ResInfo();
  let {id} = req.body;
  if (!id) return res.json(ri.set(-88, '请求参数异常'));
  UserLink.remove({_id: id}, (err) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    return res.json(ri.set(1, '删除成功'));
  })
});

app.post('/api/common-link/star', (req, res) => {
  let ri = new ResInfo();
  let {id, userId} = req.body;
  if (!id || !userId) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({_id: userId}, {_id: true}).exec((err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-88, '请求参数异常'));
    CommonLink.findOne({_id: id}, {starCount: true, starUsers: true}).exec((err, link) => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      if (!link) return res.json(ri.set(-88, '请求参数异常'));
      link.starCount++;
      link.starUsers.push(userId);
      link.save(err => {
        if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        return res.json(ri.set(1, '操作成功'));
      });
    });
  });
});

app.post('/api/common-link/unstar', (req, res) => {
  let ri = new ResInfo();
  let {id, userId} = req.body;
  if (!id || !userId) return res.json(ri.set(-88, '请求参数异常'));
  CommonLink.findOne({_id: id}, {starCount: true, starUsers: true}).exec((err, link) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!link || link.starUsers.indexOf(userId)) return res.json(ri.set(-88, '请求参数异常'));
    link.starUsers.pull(userId);
    link.starCount--;
    link.save(err => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      return res.json(ri.set(1, '操作成功'));
    });
  });
});

app.listen(4201, '10.120.224.237', () => {
  console.log('susulink server start at 10.120.224.237:4201');
});
