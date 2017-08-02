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

  private onSearchAtMobile(event) {
    this.router.navigate(['/sign-in']);
  }

}

interface IRecommendLink {
  title: string;
  href: string;
  logoUrl: string;
}
