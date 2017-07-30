import {Component, OnInit, DoCheck} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'ssl-home-list-my',
  templateUrl: './home-list-my.component.html',
  styleUrls: ['./home-list-my.component.css']
})
export class HomeListMyComponent implements OnInit, DoCheck {

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
      this.http.post('/api/links', {
        listFlag: 'my',
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
        // setTimeout(() => {
        this.links = links;
        // }, 3000);
      });
    });
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(sessionStorage.getItem('__ssl_cur_user'));
  }

  private confirmRemove() {
    let id = this.wantRemoveLink._id;
    this.http.post('/api/user_link/remove', {id}).map(res => res.json()).subscribe(ri => {
      if (ri.code !== 1) return alert(ri.msg);
      let index = this.links.findIndex(v => v._id === id);
      this.links.splice(index, 1);
      $('.ssl-home-list-my .modal').modal('hide');
    });
  }

  private wantRemoveLink: any;

  private onRemove(link) {
    this.wantRemoveLink = link;
    $('.ssl-home-list-my .modal').modal('show');
  }

}
