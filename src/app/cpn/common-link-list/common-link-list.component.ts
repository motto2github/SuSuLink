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
        // setTimeout(() => {
        this.links = links;
        this.sortLinks();
        // }, 3000);
      });
    });
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
  }

  private starHandler(link: {[key: string]: any}) {
    if (!this.curUser) return this.router.navigate(['/sign-in']);
    if (link.starUsers.indexOf(this.curUser._id) === -1) {
      this.http.post('/api/common-link/star', {id: link._id, userId: this.curUser._id}).map(res => res.json()).subscribe(ri => {
        if (ri.code !== 1) return alert(ri.msg);
        link.starCount++;
        link.starUsers.push(this.curUser._id);
        // this.sortLinks();
      });
    } else {
      this.http.post('/api/common-link/unstar', {id: link._id, userId: this.curUser._id}).map(res => res.json()).subscribe(ri => {
        if (ri.code !== 1) return alert(ri.msg);
        link.starCount--;
        link.starUsers.splice(link.starUsers.findIndex(id => id === this.curUser._id), 1);
        // this.sortLinks();
      });
    }
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(sessionStorage.getItem('__ssl_cur_user'));
  }

  private sortLinks() {
    let regexp = new RegExp(this.keywords, 'i');
    this.links.sort((a, b) => {
      if (this.keywords) {
        let a_title_test = regexp.test(a.title), a_href_test = regexp.test(a.href), a_desc_test = regexp.test(a.desc);
        let b_title_test = regexp.test(b.title), b_href_test = regexp.test(b.href), b_desc_test = regexp.test(b.desc);
        if (a_title_test && !b_title_test) return -1;
        if (!a_title_test && b_title_test) return 1;
        if (a_href_test && !b_href_test) return -1;
        if (!a_href_test && b_href_test) return 1;
        if (a_desc_test && !b_desc_test) return -1;
        if (!a_desc_test && b_desc_test) return 1;
      }
      return 0;
    });
  }

}
