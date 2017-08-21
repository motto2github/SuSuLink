import {Component, OnInit, DoCheck} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'ssl-common-link-list',
  templateUrl: './common-link-list.component.html',
  styleUrls: ['./common-link-list.component.css']
})
export class CommonLinkListComponent implements OnInit, DoCheck {

  keywords: string;

  curUser: {[key: string]: any} = this.getCurUser();

  links: any;

  private curPageNumber: number = 1;

  private pageSize = 15;

  totalCount: number = 0;

  hasMore = false;

  activeLink: any;

  constructor(private route: ActivatedRoute, private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: {keywords}) => {
      this.keywords = params.keywords;
      this.links = null;
      this.curPageNumber = 1;
      this.loadLinks();
    });
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
  }

  starHandler(event, link: {[key: string]: any}) {
    event.stopPropagation();
    if (link.__tmp_starProcessing) return;
    if (!this.curUser) return this.router.navigate(['/sign-in']);
    link.__tmp_starProcessing = true;
    setTimeout(() => {
      if (!link.___tmp_isStar) {
        this.http.post('/api/common-link/star', {id: link._id, userId: this.curUser._id}).map(res => res.json()).subscribe(ri => {
          if (ri.code !== 1) {
            alert(ri.msg);
          } else {
            link.starUsers.push(this.curUser._id);
            link.___tmp_isStar = true;
          }
          delete link.__tmp_starProcessing;
        });
      } else {
        this.http.post('/api/common-link/unstar', {id: link._id, userId: this.curUser._id}).map(res => res.json()).subscribe(ri => {
          if (ri.code !== 1) {
            alert(ri.msg);
          } else {
            link.starUsers.splice(link.starUsers.findIndex(id => id === this.curUser._id), 1);
            link.___tmp_isStar = false;
          }
          delete link.__tmp_starProcessing;
        });
      }
    }, 150);
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
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

  onLinkClick(obj) {
    window.open(obj.href);
    // if (obj === this.activeLink) return window.open(obj.href);
    // this.activeLink = obj;
  }

  onLoadMoreClick() {
    this.loadLinks();
  }

  private loadLinks() {
    this.http.post('/api/common-link/list', {
      keywords: this.keywords,
      pageNumber: this.curPageNumber++,
      pageSize: this.pageSize
    }).map(res => {
      let ri = res.json();
      if (ri.code !== 1) {
        alert(ri.msg);
        return {links: [], totalCount: 0};
      }
      ri.data.links = ri.data.links.map(link => {
        link.___tmp_isStar = this.curUser ? link.starUsers.indexOf(this.curUser._id) !== -1 : false;
        return link;
      });
      return ri.data;
    }).subscribe(data => {
      setTimeout(() => {
        if (!this.links) this.links = data.links;
        else this.links.push(...data.links);
        this.totalCount = data.totalCount;
        this.hasMore = this.links.length < this.totalCount;
        this.sortLinks();
      }, 150);
    });
  }

}
