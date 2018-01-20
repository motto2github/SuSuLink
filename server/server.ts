import * as express from 'express';
import * as path from 'path';
import * as proxy from 'http-proxy-middleware';

let app = express();

app.use('/api', proxy({
  target: 'http://qwer.ink:8008',
  changeOrigin: true,
  pathRewrite: {
    '^/api' : '/susulink-service'
  }
}));

app.use((req, res, next) => {
  let filters = ['qwer.ink', 'sl.qwer.ink', 'sulian.qwer.ink', 'susulianjie.qwer.ink', 'sslj.qwer.ink'];
  if (filters.indexOf(req.headers.host) >= 0) {
    return res.redirect('http://susulink.qwer.ink');
  }
  next();
});

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('**', (req, res) => {
  res.redirect('/');
});

// 阿里云主机内网IP：172.26.74.127
app.listen(4201, () => {
  console.log('susulink server start at localhost:4201');
});
