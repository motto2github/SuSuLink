import * as http from 'http';
import * as htmlparser from 'htmlparser2';

export class ResInfo {

  constructor(public code: number = 0, public msg: string = 'fail', public data: any = null) {
  }

  set(code: number, msg: string, data?: any) {
    this.code = code;
    this.msg = msg;
    if (data !== undefined) {
      this.data = data;
    }
    return this;
  }

}

let hot_url_info_kvs = {
  'http://baidu.com/': {title: '百度一下，你就知道', iconUrl: 'https://www.baidu.com/favicon.ico', keywords: '百度搜索', description: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。'}
  , 'http://www.baidu.com/': {title: '百度一下，你就知道', iconUrl: 'https://www.baidu.com/favicon.ico', keywords: '百度搜索', description: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。'}
  , 'http://jd.com/': {title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!'}
  , 'http://www.jd.com/': {title: '京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！', iconUrl: 'https://www.jd.com/favicon.ico', keywords: '网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表,存储卡,京东', description: '京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!'}
};

export class HTMLParser {

  static getInfo(url: string, cb: Function) {
    if (url.indexOf('https') === 0) url = 'http' + url.substring(5);
    if (url.charAt(url.length - 1) !== '/') url += '/';
    let info = hot_url_info_kvs[url];
    if (info) return cb(info);
    http.get(url, response => {
      // console.log(response.statusMessage);
      let html = '';
      response.on('data', (d) => {
        html += d.toString();
        if (html.indexOf('</head>') !== -1) response.destroy();
      });
      response.on('end', () => {
        // console.log('html:', html);
        let curTagName = '', curAttributes: any = {}, title = '', iconUrl = '', keywords = '', description = '';
        let iconUrlRegExp = new RegExp('shortcut|icon', 'gi');
        let parser = new htmlparser.Parser({
          onopentag: (name, attributes) => {
            curTagName = name;
            curAttributes = attributes;
          },
          ontext: (text) => {
            if (curTagName === 'title' && title === '') {
              title = text;
            }
            if (curTagName === 'link' && iconUrlRegExp.test(curAttributes.rel) && iconUrl === '') {
              iconUrl = curAttributes.href;
              if (iconUrl.indexOf('//') === 0) {
                iconUrl = 'http:' + iconUrl;
              } else if (iconUrl.indexOf('/') === 0) {
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
          onend: () => {
            cb({title, iconUrl, keywords, description});
          }
        });
        parser.write(html);
        parser.end();
      });
    }).on('error', e => {
      console.log("error: " + e.message);
      cb(null);
    });
  }

}
