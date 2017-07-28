import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Component({
  selector: 'ssl-home-list-all',
  templateUrl: './home-list-all.component.html',
  styleUrls: ['./home-list-all.component.css']
})
export class HomeListAllComponent implements OnInit {

  private links: Observable<Array<{[key: string]: any}>>;

  private keywords: string;

  constructor(private route: ActivatedRoute, private http: Http) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: {keywords}) => {
      this.keywords = params.keywords;
      this.links = this.http.post('/api/links', {
        listFlag: 'all',
        keywords: this.keywords
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
    // if (link.isStar) {
    //   link.isStar = false;
    //   this.myLinkObjs.splice(this.myLinkObjs.indexOf(this.myLinkObjs.find(myLinkObj => myLinkObj.href === link.href)), 1)
    //   this.commonLinkObjs.find(commonLinkObj => commonLinkObj.href === link.href).isStar = false
    // } else {
    //   link.isStar = true;
    //   this.myLinkObjs.push(link)
    // }
    // localStorage.setItem('__ssl_myLinkObjs', JSON.stringify(this.myLinkObjs))
  }

}
