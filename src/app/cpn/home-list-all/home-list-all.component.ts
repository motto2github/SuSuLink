import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {ILink} from "../home/home.component";

@Component({
  selector: 'ssl-home-list-all',
  templateUrl: './home-list-all.component.html',
  styleUrls: ['./home-list-all.component.css']
})
export class HomeListAllComponent implements OnInit {

  private links: Observable<Array<ILink>>;

  private keywords: string;

  constructor(private route: ActivatedRoute, private http: Http) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: {keywords}) => {
      this.keywords = params.keywords;
      this.links = this.http.post('/api/links', {listFlag: 'all', keywords: this.keywords}).map(res => res.json().data);
    });
  }

  private starHandler(link: ILink) {
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
