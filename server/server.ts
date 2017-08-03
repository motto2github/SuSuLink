import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as path from 'path';
import {CommonLink} from "./model/CommonLink";
import {ResInfo} from "./util";
import {User} from "./model/User";
import {UserLink} from "./model/UserLink";

mongoose.connect('mongodb://localhost:6969/susulink', (err) => {
  if (err) return console.error(err);
  console.log('db connect success, at mongodb://localhost:6969/susulink');
});

let app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json());

app.get('**', (req, res) => {
  res.redirect('/');
});

app.post('/api/common-link/list', (req, res) => {
  let ri = new ResInfo();
  let {keywords} = req.body;
  let condition = null;
  if (keywords) {
    keywords = keywords.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
    let regexp = new RegExp(keywords, 'i');
    condition = {$or: [{title: regexp}, {href: regexp}, {summary: regexp}]};
  } else condition = {};
  CommonLink.find(condition, {title: true, href: true, summary: true, starUsers: true, sortNumber: true}).exec((err, links) => {
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
      keywords = keywords.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
      let regexp = new RegExp(keywords, 'i');
      condition = {owner: curUserId, $or: [{title: regexp}, {href: regexp}, {summary: regexp}]};
    } else condition = {owner: curUserId};
    UserLink.find(condition, {title: true, href: true, summary: true, owner: true}).exec((err, links) => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试', {errMsg: err.message}));
      res.json(ri.set(1, 'success', {links}));
    });
  });
});

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

app.post('/api/reset-password', (req, res) => {
  let ri = new ResInfo();
  let {userId, oldPassword, newPassword} = req.body;
  if (!userId || !oldPassword || !newPassword) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({_id: userId, password: oldPassword}, {password: true}, (err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-1, '旧密码不正确'));
    user.password = newPassword;
    user.save((err) => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      return res.json(ri.set(1, '修改成功'));
    });
  });
});

app.post('/api/user-link/insert', (req, res) => {
  let ri = new ResInfo();
  let {title, href, summary, curUserId} = req.body;
  if (!title || !href || !curUserId) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({_id: curUserId}, {_id: true}, (err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-88, '请求参数异常'));
    UserLink.findOne({owner: curUserId, title}, {_id: true}).exec((err, link) => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      if (link) return res.json(ri.set(-1, '该标题已存在'));
      new UserLink({title, href, summary, owner: curUserId}).save(err => {
        if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
        return res.json(ri.set(1, '添加成功'));
      });
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

app.post('/api/user-link/update', (req, res) => {
  let ri = new ResInfo();
  let {_id, title, href, summary, owner} = req.body;
  if (!_id || !owner || !title || !href) return res.json(ri.set(-88, '请求参数异常'));
  UserLink.findOne({_id, owner}, (err, link) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!link) return res.json(ri.set(-88, '请求参数异常'));
    link.title = title;
    link.href = href;
    link.summary = summary;
    link.save(err => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      return res.json(ri.set(1, '修改成功'));
    });
  });
});

app.post('/api/user-link/findone', (req, res) => {
  let ri = new ResInfo();
  let {id, userId} = req.body;
  if (!id || !userId) return res.json(ri.set(-88, '请求参数异常'));
  UserLink.findOne({_id: id, owner: userId}, {title: true, href: true, summary: true, owner: true}).exec((err, link) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!link) return res.json(ri.set(-88, '请求参数异常'));
    return res.json(ri.set(1, '查找成功', {link: link}));
  });
});

app.post('/api/common-link/star', (req, res) => {
  let ri = new ResInfo();
  let {id, userId} = req.body;
  if (!id || !userId) return res.json(ri.set(-88, '请求参数异常'));
  User.findOne({_id: userId}, {_id: true}).exec((err, user) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!user) return res.json(ri.set(-88, '请求参数异常'));
    CommonLink.findOne({_id: id}, {starUsers: true}).exec((err, link) => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      if (!link) return res.json(ri.set(-88, '请求参数异常'));
      CommonLink.update({_id: id}, {$addToSet: {starUsers: userId}}).exec(err => {
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
  CommonLink.findOne({_id: id}, {starUsers: true}).exec((err, link) => {
    if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
    if (!link || link.starUsers.indexOf(userId) === -1) return res.json(ri.set(-88, '请求参数异常'));
    link.starUsers.pull(userId);
    link.save(err => {
      if (err) return res.json(ri.set(-99, '数据库异常，请稍后重试'));
      return res.json(ri.set(1, '操作成功'));
    });
  });
});

app.listen(4201, 'localhost', () => {
  console.log('susulink server start at localhost:4201');
});
