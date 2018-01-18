import * as express from 'express';
import * as path from 'path';
import * as proxy from 'http-proxy-middleware';

let app = express();

app.use('/api', proxy({
  target: 'http://localhost:9000',
  changeOrigin: true,
  pathRewrite: {
    '^/api' : '/susulink-service'
  }
}));

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('**', (req, res) => {
  res.redirect('/');
});

// 阿里云主机内网IP：172.26.74.127
app.listen(4201, () => {
  console.log('susulink server start at localhost:4201');
});
