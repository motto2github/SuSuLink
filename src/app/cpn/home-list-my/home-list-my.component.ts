import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'ssl-home-list-my',
  templateUrl: './home-list-my.component.html',
  styleUrls: ['./home-list-my.component.css']
})
export class HomeListMyComponent implements OnInit {

  private links: Observable<Array<{[key: string]: any}>>;

  private keywords: string;

  private curUser: {[key: string]: any};

  constructor(private route: ActivatedRoute, private http: Http) {
  }

  ngOnInit() {
    this.curUser = JSON.parse(sessionStorage.getItem('__ssl_cur_user'));
    this.route.params.subscribe((params: {keywords}) => {
      this.keywords = params.keywords;
      this.links = this.http.post('/api/links', {
        listFlag: 'my',
        keywords: this.keywords,
        curUserId: this.curUser ? this.curUser._id : null
      }).map(res => {
        let ri = res.json();
        if (ri.code !== 1) {
          alert(ri.msg);
          return [];
        }
        return ri.data.links;
      });
    });
  }

  private starHandler(link: {[key: string]: any}) {
    // if (linkObj.isStar) {
    //   linkObj.isStar = false
    //   this.myLinkObjs.splice(this.myLinkObjs.indexOf(this.myLinkObjs.find(myLinkObj => myLinkObj.href === linkObj.href)), 1)
    //   this.commonLinkObjs.find(commonLinkObj => commonLinkObj.href === linkObj.href).isStar = false
    // } else {
    //   linkObj.isStar = true
    //   this.myLinkObjs.push(linkObj)
    // }
    // localStorage.setItem('__ssl_myLinkObjs', JSON.stringify(this.myLinkObjs))
  }

}
