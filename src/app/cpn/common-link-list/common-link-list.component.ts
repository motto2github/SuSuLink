import {Component, OnInit, DoCheck} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'ssl-common-link-list',
  templateUrl: './common-link-list.component.html',
  styleUrls: ['./common-link-list.component.css']
})
export class CommonLinkListComponent implements OnInit, DoCheck {

  private keywords: string;

  private curUser: {[key: string]: any} = this.getCurUser();

  private links: any;

  constructor(private route: ActivatedRoute, private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: {keywords}) => {
      this.keywords = params.keywords;
      this.links = null;
      this.http.post('/api/common-link/list', {keywords: this.keywords}).map(res => {
        let ri = res.json();
        if (ri.code !== 1) {
          alert(ri.msg);
          return [];
        }
        return ri.data.links;
      }).subscribe(links => {
        setTimeout(() => {
          this.links = links;
          this.sortLinks();
        }, 300);
      });
    });
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
  }

  private starHandler(link: {[key: string]: any}) {
    if (link.__tmp_starProcessing) return;
    if (!this.curUser) return this.router.navigate(['/sign-in']);
    link.__tmp_starProcessing = true;
    setTimeout(() => {
      if (link.starUsers.indexOf(this.curUser._id) === -1) {
        this.http.post('/api/common-link/star', {id: link._id, userId: this.curUser._id}).map(res => res.json()).subscribe(ri => {
          if (ri.code !== 1) {
            alert(ri.msg);
          } else {
            link.starUsers.push(this.curUser._id);
          }
          delete link.__tmp_starProcessing;
        });
      } else {
        this.http.post('/api/common-link/unstar', {id: link._id, userId: this.curUser._id}).map(res => res.json()).subscribe(ri => {
          if (ri.code !== 1) {
            alert(ri.msg);
          } else {
            link.starUsers.splice(link.starUsers.findIndex(id => id === this.curUser._id), 1);
          }
          delete link.__tmp_starProcessing;
        });
      }
    }, 300);
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(sessionStorage.getItem('__ssl_cur_user'));
  }

  private sortLinks() {
    let regexp = new RegExp(this.keywords.replace(/\\/g, '\\\\'), 'i');
    this.links.sort((a, b) => {
      if (this.keywords) {
        let a_title_test = regexp.test(a.title), a_href_test = regexp.test(a.href), a_summary_test = regexp.test(a.summary);
        let b_title_test = regexp.test(b.title), b_href_test = regexp.test(b.href), b_summary_test = regexp.test(b.summary);
        if (a_title_test && !b_title_test) return -1;
        if (!a_title_test && b_title_test) return 1;
        if (a_href_test && !b_href_test) return -1;
        if (!a_href_test && b_href_test) return 1;
        if (a_summary_test && !b_summary_test) return -1;
        if (!a_summary_test && b_summary_test) return 1;
      }
      if (a.starUsers.length > b.starUsers.length) return -1;
      if (a.starUsers.length < b.starUsers.length) return 1;
      return a.sortNumber - b.sortNumber;
    });
  }

  private onDblclick(href) {
    window.open(href);
  }

}

/*
 // 直接拷贝粘贴到mongodb控制台insert，不要改文本结构，否则会报错：[右边不能有空格，]左边不能有空格
 // 1. var links = 粘贴并回车
 // 2. db.common_links.insert(links);
 [{
 "_id": ObjectId("5976b4dea10118ede7b13f12"),
 "title": "Angular 中文网",
 "href": "https://angular.cn",
 "summary": "AngularJS诞生于2009年，由Misko Hevery 等人创建，后为Google所收购。是一款优秀的前端JS框架，已经被用于Google的多款产品当中。AngularJS有着诸多特性，最为核心的是：MVC、模块化、自动化双向数据绑定、语义化标签、依赖注入等等。",
 "starUsers": [ObjectId("597c56005fc64e0060948269")],
 "sortNumber": 0,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f10"),
 "title": "Backbone 官网",
 "href": "http://backbonejs.org",
 "summary": "Backbone.js为复杂WEB应用程序提供模型(models)、集合(collections)、视图(views)的结构。其中模型用于绑定键值数据和自定义事件；集合附有可枚举函数的丰富API； 视图可以声明事件处理函数，并通过RESRful JSON接口连接到应用程序。",
 "starUsers": [],
 "sortNumber": 1,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f0e"),
 "title": "Bootstrap 中文网",
 "href": "http://www.bootcss.com",
 "summary": "Bootstrap中文网 -- www.bootcss.com 创建于2012年。起因是国内没有较好的关于Bootstrap的中文教程和交流渠道，因此，我们对Bootstrap的文档进行了翻译整理bootcss），方便更多热爱这个CSS框架的攻城师们分享、交流自己在前端设计、开发方面的心得。",
 "starUsers": [],
 "sortNumber": 2,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976ef7f7de0cb937b2475f8"),
 "title": "ECMAScript 6 入门 - 阮一峰",
 "href": "http://es6.ruanyifeng.com",
 "summary": "本书覆盖 ES6 与上一个版本 ES5 的所有不同之处，对涉及的语法知识给予详细介绍，并给出大量简洁易懂的示例代码。本书为中级难度，适合已经掌握 ES5 的读者入门》，2017年下半年即将推出第三版。纸版是基于网站内容排版印刷的。感谢张春雨编辑支持我将全书开源的做法。如果您认可这本书，建议购买纸版。这样可以使出版社不因出版开源书籍而亏钱，进而鼓励更多的作者开源自己的书籍。下面是第二版的购买地址。",
 "starUsers": [],
 "sortNumber": 3,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f0d"),
 "title": "GitHub",
 "href": "https://github.com",
 "summary": "gitHub是一个面向开源及私有软件项目的托管平台，因为只支持git作为唯一的版本库格式进行托管，故名gitHub。gitHub于2008年4月10日正式上线，除了git代码仓享（Gist）等功能。目前，其注册用户已经超过350万，托管版本数量也是非常之多，其中不乏知名开源项目 Ruby on Rails、jQuery、python 等。",
 "starUsers": [],
 "sortNumber": 4,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f15"),
 "title": "Lodash 官网",
 "href": "https://lodash.com",
 "summary": "Lodash 是一个具有一致接口、模块化、高性能等特性的 JavaScript 工具库。",
 "starUsers": [],
 "sortNumber": 5,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f16"),
 "title": "Moment.js 中文网",
 "href": "http://momentjs.cn",
 "summary": "Moment.js 是一个 JavaScript 日期处理类库,用于解析、检验、操作、以及显示日期。",
 "starUsers": [],
 "sortNumber": 6,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f11"),
 "title": "React 官网",
 "href": "https://facebook.github.ioreact",
 "summary": "React 是一个用于构建用户界面的 JAVASCRIPT 库。React主要用于构建UI，很多人认为 React 是 MVC 中的 V（视图）。React 起源于 Facebook 的内部项目，用来架设 Instag越来越多的人已开始关注和使用它。",
 "starUsers": [ObjectId("597c56005fc64e0060948269")],
 "sortNumber": 7,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f14"),
 "title": "TypeScript",
 "href": "http://www.typescriptlang.org",
 "summary": "TypeScript是一种由微软开发的自由和开源的编程语言。它是JavaScript的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。安德ript，2013年6月19日，在经历了一个预览版之后微软正式发布了正式版TypeScript 0.9，向未来的TypeScript 1.0版迈进了很大一步。",
 "starUsers": [ObjectId("597c56005fc64e0060948269")],
 "sortNumber": 8,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f13"),
 "title": "Vue 中文网",
 "href": "http://cn.vuejs.org",
 "summary": "Vue.js（读音 /vjuː/, 类似于 view）是一个构建数据驱动的 web 界面的渐进式框架。Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。",
 "starUsers": [],
 "sortNumber": 9,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f0f"),
 "title": "jQuery 官网",
 "href": "http://jquery.com",
 "summary": "jQuery是一个快速、简洁的JavaScript框架，是继Prototype之后又一个优秀的JavaScript代码库（或JavaScript框架）。jQuery设计的宗旨是“write Less，Do Mor代码，提供一种简便的JavaScript设计模式，优化HTML文档操作、事件处理、动画设计和Ajax交互。",
 "starUsers": [],
 "sortNumber": 10,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f17"),
 "title": "百度翻译",
 "href": "http://fanyi.baidu.com",
 "summary": "百度翻译是百度发布的在线翻译服务，依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。百度翻译支持全大利语、荷兰语、希腊语、爱沙尼亚语、保加利亚语、波兰语、丹麦语、芬兰语、捷克语、罗马尼亚语、瑞典语、斯洛文尼亚语、匈牙利语、越南语、粤语、文言文和中文繁体等，覆盖756个翻译方义、海量例句、权威词典、离线翻译、语音翻译、对话翻译、实用口语和拍照翻译等功能，让用户畅享每一次翻译体验。",
 "starUsers": [],
 "sortNumber": 11,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f0c"),
 "title": "百度一下，你就知道",
 "href": "http://www.baidu.com",
 "summary": "全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。百度超过千亿的中文网页数据库，可以瞬间找到相关的搜索结果。",
 "starUsers": [],
 "sortNumber": 12,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f18"),
 "title": "必应",
 "href": "http://cn.bing.com",
 "summary": "微软必应搜索是国际领先的搜索引擎，为中国用户提供网页、图片、视频、词典、翻译、资讯、地图等全球信息搜索服务。微软必应（英文名：Bing）是微软公司于新搜索引擎服务。为符合中国用户使用习惯，Bing中文品牌名为“必应”。作为全球领先的搜索引擎之一，截至2013年5月，必应已成为北美地区第二大搜索引擎，如加上为雅虎提供的搜索技术支持，微软品牌第四个重要产品线，也标志着必应已不仅仅是一个搜索引擎，更将深度融入微软几乎所有的服务与产品中。在Windows Phone系统中，微软也深度整合了必应搜索，通过触摸搜索键引出，相比其他搜索引擎，界面也更加美观，整合信息也更加全面。",
 "starUsers": [],
 "sortNumber": 13,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("5976b4dea10118ede7b13f19"),
 "title": "菜鸟教程",
 "href": "http://www.runoob.com",
 "summary": "菜鸟教程提供了最全的基础编程技术教程。菜鸟教程的 Slogan 为：学的不仅是技术，更是梦想！记住：再牛逼的梦想也抵不住傻逼似的坚持！本站域名为 runoob.t、PHP、C、Python等各种基础编程教程。同时本站中也提供了大量的在线实例，通过实例，您可以更好地学习如何建站。本站致力于推广各种编程语言技术，所有资源是完全免费的，并且会根据当前互联网的变化实时更新本站内容。同时本站内容如果有不足的地方，也欢迎广大编程爱好者在本站留言提供意见。",
 "starUsers": [ObjectId("597c56005fc64e0060948269")],
 "sortNumber": 14,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 },
 {
 "_id": ObjectId("597ee9fa37bb511f899f8bed"),
 "title": "慕课网",
 "href": "http://www.imooc.com",
 "starUsers": [],
 "summary": "慕课网是垂直的互联网IT技能免费学习网站。以独家视频教程、在线编程工具、学习计划、问答社区为核心特色。在这里，你可以找到最好的互联网技术牛人，也可以通过免费的在线公开视频课程学习国内领先的互联网IT技术。",
 "sortNumber": 15,
 "createAt": 1500951895436,
 "updateAt": 1500951895436
 }]
 */
