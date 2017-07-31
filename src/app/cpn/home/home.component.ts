import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import 'bootstrap';
import 'jquery';
import 'rxjs';

@Component({
  selector: 'ssl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  private recommendLinkObjs: Array<IRecommendLink> = [
    {title: '百度一下，你就知道', href: 'http://www.baidu.com/', logoUrl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png'}
    , {title: 'GitHub', href: 'https://github.com/', logoUrl: 'https://assets-cdn.github.com/favicon.ico'}
    , {title: 'Bootstrap 中文网', href: 'http://www.bootcss.com/', logoUrl: 'http://www.bootcdn.cn/assets/img/bootstrap.svg?1500283050537'}
    , {title: 'Angular 中文网', href: 'https://angular.cn/', logoUrl: 'http://www.bootcdn.cn/assets/img/angular-icon.svg?1500283050537'}
    , {title: 'Vue 中文网', href: 'http://cn.vuejs.org/', logoUrl: 'http://www.bootcdn.cn/assets/img/vue.svg?1500283050537'}
    , {title: 'React 官网', href: 'https://facebook.github.io/react/', logoUrl: 'http://www.bootcdn.cn/assets/img/react.svg?1500283050537'}
    , {title: 'jQuery 官网', href: 'http://jquery.com/', logoUrl: 'http://www.bootcdn.cn/assets/img/jquery.svg?1500283050537'}
    , {title: 'Lodash 官网', href: 'https://lodash.com/', logoUrl: 'http://www.bootcdn.cn/assets/img/lodash.svg?1500283050537'}
    , {title: 'Moment.js 中文网', href: 'http://momentjs.cn/', logoUrl: 'http://www.bootcdn.cn/assets/img/momentjs.svg?1500283050537'}
    , {title: 'TypeScript', href: 'http://www.typescriptlang.org/', logoUrl: 'http://www.typescriptlang.org/assets/images/icons/favicon-32x32.png'}
  ];

  private listFlag: string;

  private keywords: FormControl = new FormControl();

  constructor(private router: Router) {
  }

  ngOnInit() {
    let params = location.pathname.split('/');
    this.keywords.setValue(decodeURIComponent(params[4]), {emitEvent: false});
    this.listFlag = params[2];
    this.keywords.valueChanges.debounceTime(300).subscribe((value) => {
      this.router.navigate([`/home/${this.listFlag}/list`, value]);
    });
  }

  private switchList(flag: string) {
    this.listFlag = flag;
    this.router.navigate([`/home/${this.listFlag}/list`, this.keywords.value || '']);
  }

  ngAfterViewInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }

}

interface IRecommendLink {
  title: string;
  href: string;
  logoUrl: string;
}

// export interface ILink {
//   id: any;
//   title: string;
//   href: string;
//   starCount: number;
//   desc: string;
//   isStar: boolean;
// }

// export let commonLinkObjs: Array<ILink> = [
//   {id: '__ssl_commonLinkObj_0', title: '百度一下，你就知道', href: 'http://www.baidu.com/', isStar: false, starCount: 9787361, desc: '全球最大的中文搜索引擎、致力于让网民更便捷地获取信息，找到所求。百度超过千亿的中文网页数据库，可以瞬间找到相关的搜索结果。'}
//   , {id: '__ssl_commonLinkObj_1', title: 'GitHub', href: 'https://github.com/', isStar: false, starCount: 8426281, desc: 'gitHub是一个面向开源及私有软件项目的托管平台，因为只支持git作为唯一的版本库格式进行托管，故名gitHub。gitHub于2008年4月10日正式上线，除了git代码仓库托管及基本的 Web管理界面以外，还提供了订阅、讨论组、文本渲染、在线文件编辑器、协作图谱（报表）、代码片段分享（Gist）等功能。目前，其注册用户已经超过350万，托管版本数量也是非常之多，其中不乏知名开源项目 Ruby on Rails、jQuery、python 等。'}
//   , {id: '__ssl_commonLinkObj_2', title: 'Bootstrap 中文网', href: 'http://www.bootcss.com/', isStar: false, starCount: 8372628, desc: 'Bootstrap中文网 -- www.bootcss.com 创建于2012年。起因是国内没有较好的关于Bootstrap的中文教程和交流渠道，因此，我们对Bootstrap的文档进行了翻译整理，并且建立了QQ群和微博（@bootcss），方便更多热爱这个CSS框架的攻城师们分享、交流自己在前端设计、开发方面的心得。'}
//   , {id: '__ssl_commonLinkObj_3', title: 'jQuery 官网', href: 'http://jquery.com/', isStar: false, starCount: 7162739, desc: 'jQuery是一个快速、简洁的JavaScript框架，是继Prototype之后又一个优秀的JavaScript代码库（或JavaScript框架）。jQuery设计的宗旨是“write Less，Do More”，即倡导写更少的代码，做更多的事情。它封装JavaScript常用的功能代码，提供一种简便的JavaScript设计模式，优化HTML文档操作、事件处理、动画设计和Ajax交互。'}
//   , {id: '__ssl_commonLinkObj_4', title: 'Backbone 官网', href: 'http://backbonejs.org/', isStar: false, starCount: 1923748, desc: 'Backbone.js为复杂WEB应用程序提供模型(models)、集合(collections)、视图(views)的结构。其中模型用于绑定键值数据和自定义事件；集合附有可枚举函数的丰富API； 视图可以声明事件处理函数，并通过RESRful JSON接口连接到应用程序。'}
//   , {id: '__ssl_commonLinkObj_5', title: 'React 官网', href: 'https://facebook.github.io/react/', isStar: false, starCount: 82734, desc: 'React 是一个用于构建用户界面的 JAVASCRIPT 库。React主要用于构建UI，很多人认为 React 是 MVC 中的 V（视图）。React 起源于 Facebook 的内部项目，用来架设 Instagram 的网站，并于 2013 年 5 月开源。React 拥有较高的性能，代码逻辑非常简单，越来越多的人已开始关注和使用它。'}
//   , {id: '__ssl_commonLinkObj_6', title: 'Angular 中文网', href: 'https://angular.cn/', isStar: false, starCount: 7930822, desc: 'AngularJS诞生于2009年，由Misko Hevery 等人创建，后为Google所收购。是一款优秀的前端JS框架，已经被用于Google的多款产品当中。AngularJS有着诸多特性，最为核心的是：MVC、模块化、自动化双向数据绑定、语义化标签、依赖注入等等。'}
//   , {id: '__ssl_commonLinkObj_7', title: 'Vue 中文网', href: 'http://cn.vuejs.org/', isStar: false, starCount: 1029384, desc: 'Vue.js（读音 /vjuː/, 类似于 view）是一个构建数据驱动的 web 界面的渐进式框架。Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。'}
//   , {id: '__ssl_commonLinkObj_8', title: 'TypeScript', href: 'http://www.typescriptlang.org/', isStar: false, starCount: 7384112, desc: 'TypeScript是一种由微软开发的自由和开源的编程语言。它是JavaScript的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。安德斯·海尔斯伯格，C#的首席架构师，已工作于TypeScript的开发。2012年十月份，微软发布了首个公开版本的TypeScript，2013年6月19日，在经历了一个预览版之后微软正式发布了正式版TypeScript 0.9，向未来的TypeScript 1.0版迈进了很大一步。'}
//   , {id: '__ssl_commonLinkObj_9', title: 'Lodash 官网', href: 'https://lodash.com/', isStar: false, starCount: 123349, desc: 'Lodash 是一个具有一致接口、模块化、高性能等特性的 JavaScript 工具库。'}
//   , {id: '__ssl_commonLinkObj_10', title: 'Moment.js 中文网', href: 'http://momentjs.cn/', isStar: false, starCount: 384718, desc: 'Moment.js 是一个 JavaScript 日期处理类库,用于解析、检验、操作、以及显示日期。'}
//   , {id: '__ssl_commonLinkObj_11', title: '百度翻译', href: 'http://fanyi.baidu.com/', isStar: false, starCount: 632812, desc: '百度翻译是百度发布的在线翻译服务，依托互联网数据资源和自然语言处理技术优势，致力于帮助用户跨越语言鸿沟，方便快捷地获取信息和服务。百度翻译支持全球28种热门语言互译，包括中文、英语、日语、韩语、西班牙语、泰语、法语、阿拉伯语、葡萄牙语、俄语、德语、意大利语、荷兰语、希腊语、爱沙尼亚语、保加利亚语、波兰语、丹麦语、芬兰语、捷克语、罗马尼亚语、瑞典语、斯洛文尼亚语、匈牙利语、越南语、粤语、文言文和中文繁体等，覆盖756个翻译方向。百度翻译拥有网页版和手机APP等多种产品形态，此外还针对开发者提供开放云接口服务，日均响应上亿次翻译请求。除文本翻译外，结合用户多样性的翻译需求，推出网页翻译、网络释义、海量例句、权威词典、离线翻译、语音翻译、对话翻译、实用口语和拍照翻译等功能，让用户畅享每一次翻译体验。'}
//   , {id: '__ssl_commonLinkObj_12', title: '必应', href: 'http://cn.bing.com/', isStar: false, starCount: 2198471, desc: '微软必应搜索是国际领先的搜索引擎，为中国用户提供网页、图片、视频、词典、翻译、资讯、地图等全球信息搜索服务。微软必应（英文名：Bing）是微软公司于2009年5月28日推出，用以取代Live Search的全新搜索引擎服务。为符合中国用户使用习惯，Bing中文品牌名为“必应”。作为全球领先的搜索引擎之一，截至2013年5月，必应已成为北美地区第二大搜索引擎，如加上为雅虎提供的搜索技术支持，必应已占据29.3%的市场份额。2013年10月，微软在中国启用全新明黄色必应搜索标志并去除Beta标识，这使必应成为继Windows、Office和Xbox后的微软品牌第四个重要产品线，也标志着必应已不仅仅是一个搜索引擎，更将深度融入微软几乎所有的服务与产品中。在Windows Phone系统中，微软也深度整合了必应搜索，通过触摸搜索键引出，相比其他搜索引擎，界面也更加美观，整合信息也更加全面。'}
// ];
