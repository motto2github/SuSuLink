import {Component, OnInit, DoCheck} from '@angular/core';

@Component({
  selector: 'ssl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {

  private curUser: {[key: string]: any};

  constructor() {
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    this.curUser = JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
  }

  private signOut() {
    localStorage.removeItem('__ssl_cur_user');
    sessionStorage.removeItem('__ssl_cur_user');
  }

}
