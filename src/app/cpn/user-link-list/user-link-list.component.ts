import {Component, OnInit, DoCheck} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'ssl-user-link-list',
  templateUrl: './user-link-list.component.html',
  styleUrls: ['./user-link-list.component.css']
})
export class UserLinkListComponent implements OnInit, DoCheck {

  private keywords: string;

  private curUser: {[key: string]: any} = this.getCurUser();

  private links: any;

  constructor(private route: ActivatedRoute, private http: Http) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: {keywords}) => {
      this.keywords = params.keywords;
      this.links = null;
      if (!this.curUser) return;
      this.http.post('/api/user-link/list', {
        keywords: this.keywords,
        curUserId: this.curUser._id
      }).map(res => {
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
    return JSON.parse(sessionStorage.getItem('__ssl_cur_user'));
  }

  private wantRemoveLink: any;

  private onRemove(link) {
    this.wantRemoveLink = link;
    $('.ssl-user-link-list .modal').modal('show');
  }

  private confirmRemove() {
    let id = this.wantRemoveLink._id;
    this.http.post('/api/user-link/remove', {id}).map(res => res.json()).subscribe(ri => {
      if (ri.code !== 1) return alert(ri.msg);
      let index = this.links.findIndex(v => v._id === id);
      this.links.splice(index, 1);
      $('.ssl-user-link-list .modal').modal('hide');
    });
  }

  private onDblclick(href) {
    window.open(href);
  }

}
