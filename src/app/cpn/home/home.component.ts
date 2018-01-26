import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute, UrlSegment} from "@angular/router";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'ssl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  recommendLinkObjs: Array<IRecommendLink> = [
    {title: '百度一下，你就知道', href: 'http://www.baidu.com', logoUrl: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png'}
    , {title: 'GitHub', href: 'https://github.com', logoUrl: 'https://assets-cdn.github.com/favicon.ico'}
    , {title: 'Bootstrap 中文网', href: 'http://www.bootcss.com', logoUrl: 'http://www.bootcdn.cn/assets/img/bootstrap.svg?1500283050537'}
    , {title: 'Angular 中文网', href: 'https://angular.cn', logoUrl: 'http://www.bootcdn.cn/assets/img/angular-icon.svg?1500283050537'}
    , {title: 'Vue 中文网', href: 'http://cn.vuejs.org', logoUrl: 'http://www.bootcdn.cn/assets/img/vue.svg?1500283050537'}
    , {title: 'React 官网', href: 'https://facebook.github.io/react', logoUrl: 'http://www.bootcdn.cn/assets/img/react.svg?1500283050537'}
    , {title: 'jQuery 官网', href: 'http://jquery.com', logoUrl: 'http://www.bootcdn.cn/assets/img/jquery.svg?1500283050537'}
    , {title: 'Lodash 官网', href: 'https://lodash.com', logoUrl: 'http://www.bootcdn.cn/assets/img/lodash.svg?1500283050537'}
    , {title: 'Moment.js 中文网', href: 'http://momentjs.cn', logoUrl: 'http://www.bootcdn.cn/assets/img/momentjs.svg?1500283050537'}
    , {title: 'TypeScript', href: 'http://www.typescriptlang.org', logoUrl: 'http://www.typescriptlang.org/assets/images/icons/favicon-32x32.png'}
  ];

  listFlag: string;

  keywords: FormControl = new FormControl();

  private search_histories: Array<string>;

  constructor(private route: ActivatedRoute, private router: Router) {
    if (this.router.routerState.snapshot.url === '/home') {
      const cur_user = localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user');
      this.router.navigate([`/home/${cur_user ? 'user-link' : 'common-link'}/list`]);
    }
  }

  ngOnInit() {
    let firstChildUrlSegment: UrlSegment[] = this.route.snapshot.firstChild.url;
    this.keywords.setValue(decodeURIComponent(firstChildUrlSegment[2].path), {emitEvent: false});
    this.listFlag = firstChildUrlSegment[0].path;
    this.search_histories = JSON.parse(localStorage.getItem('__ssl_search_histories')) || [];
    /*this.keywords.valueChanges.debounceTime(300).subscribe((value) => {
      this.keywords.setValue(value.trim(), {emitEvent: false});
      if (this.keywords.value !== '') {
        this.search_histories = this.search_histories.filter(item => this.keywords.value !== item);
        this.search_histories.unshift(this.keywords.value);
        localStorage.setItem('__ssl_search_histories', JSON.stringify(this.search_histories));
      }
      this.router.navigate([`/home/${this.listFlag}/list`, this.keywords.value]);
    });*/
    /*this.keywords.valueChanges.subscribe((value) => {
      this.keywords.setValue(value.trim(), {emitEvent: false});
    });*/
  }

  switchList(flag: string) {
    this.listFlag = flag;
    let keywordsValue = this.keywords.value.trim();
    this.keywords.setValue(keywordsValue, {emitEvent: false});
    this.router.navigate([`/home/${this.listFlag}/list`, keywordsValue]);
  }

  ngAfterViewInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }

  onSearchAtPc() {
    let keywordsValue = this.keywords.value.trim();
    this.keywords.setValue(keywordsValue, {emitEvent: false});
    if (keywordsValue !== '') {
      this.search_histories = this.search_histories.filter(item => keywordsValue !== item);
      this.search_histories.unshift(keywordsValue);
      localStorage.setItem('__ssl_search_histories', JSON.stringify(this.search_histories));
    }
    this.router.navigate([`/home/${this.listFlag}/list`, keywordsValue]);
  }

  onSearchAtMobile() {
    let keywordsValue = this.keywords.value.trim();
    this.keywords.setValue(keywordsValue, {emitEvent: false});
    this.router.navigate(['/search-link', this.listFlag, keywordsValue]);
  }

}

interface IRecommendLink {
  title: string;
  href: string;
  logoUrl: string;
}
