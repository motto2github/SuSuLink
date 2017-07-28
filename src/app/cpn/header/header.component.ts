import {Component, OnInit, DoCheck} from '@angular/core';

@Component({
  selector: 'ssl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {

  private curUser;

  constructor() {
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    let curUser = sessionStorage.getItem('__ssl_cur_user');
    if (curUser && !this.curUser) {
      this.curUser = JSON.parse(curUser);
    }
  }

  private signOut() {
    this.curUser = null;
    sessionStorage.removeItem('__ssl_cur_user');
  }

}
