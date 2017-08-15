import {Component, OnInit, DoCheck} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'ssl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {

  private curUser: {[key: string]: any} = this.getCurUser();

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
  }

  private signOut() {
    localStorage.removeItem('__ssl_cur_user');
    sessionStorage.removeItem('__ssl_cur_user');
  }

  private onClickLogoText() {
    if (this.router.routerState.snapshot.url.startsWith('/home')) $('.jsc-ssl-btn-common-link:visible').click();
    else this.router.navigate(['/']);
  }

  private onClickUserName() {
    if (this.router.routerState.snapshot.url.startsWith('/home')) $('.jsc-ssl-btn-user-link:visible').click();
    else this.router.navigate(['/home/user-link/list']);
  }

}
