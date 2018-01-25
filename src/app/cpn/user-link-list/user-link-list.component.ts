import {Component, OnInit, DoCheck, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'ssl-user-link-list',
  templateUrl: './user-link-list.component.html',
  styleUrls: ['./user-link-list.component.css']
})
export class UserLinkListComponent implements OnInit, DoCheck {

  keywords: string;

  curUser: {[key: string]: any} = this.getCurUser();

  links: any;

  private curPageNumber: number = 1;

  private pageSize = 20;

  totalCount: number = 0;

  hasMore = false;

  loadMoreProcessing = false;

  private activeLink: any;

  constructor(private route: ActivatedRoute, private http: Http) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: {keywords}) => {
      this.keywords = params.keywords;
      this.links = null;
      this.curPageNumber = 1;
      if (!this.curUser) return;
      this.loadLinks();
    });
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
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
      return 0;
    });
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
  }

  wantRemoveLink: any;

  onRemove(event, link) {
    event.stopPropagation();
    this.wantRemoveLink = link;
    $('.ssl-user-link-list .modal').modal('show');
  }

  confirmRemove() {
    let id = this.wantRemoveLink.id;
    this.http.post('/api/user-link/remove', {id}).map(res => res.json()).subscribe(ri => {
      if (ri.code !== '1') return alert(ri.msg);
      let index = this.links.findIndex(v => v.id === id);
      this.links.splice(index, 1);
      this.totalCount--;
      $('.ssl-user-link-list .modal').modal('hide');
    });
  }

  onLinkClick(obj) {
    window.open(obj.href);
    // if (obj === this.activeLink) return window.open(obj.href);
    // this.activeLink = obj;
  }

  onLoadMoreClick() {
    if (this.loadMoreProcessing) return;
    this.loadLinks();
  }

  private loadLinks() {
    this.loadMoreProcessing = true;
    this.http.post('/api/user-link/list', {
      keywords: this.keywords,
      user_id: this.curUser.id,
      page_number: this.curPageNumber++,
      page_size: this.pageSize
    }).map(res => {
      let ri = res.json();
      if (ri.code !== '1') {
        alert(ri.msg);
        return {links: [], totalCount: 0};
      }
      return ri.data;
    }).subscribe(data => {
      // setTimeout(() => {
        if (!this.links) this.links = data.links;
        else this.links.push(...data.links);
        this.totalCount = data.totalCount;
        this.hasMore = this.links.length < this.totalCount;
        // this.sortLinks();
        this.loadMoreProcessing = false;
      // }, 150);
    });
  }

}
