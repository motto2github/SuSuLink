import {Component, OnInit, DoCheck, AfterViewInit, AfterViewChecked, AfterContentInit, AfterContentChecked} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ssl-user-link-update',
  templateUrl: './user-link-update.component.html',
  styleUrls: ['./user-link-update.component.css']
})
export class UserLinkUpdateComponent implements OnInit, DoCheck, AfterViewInit {

  fg: FormGroup;

  errMsg: string;

  curUser: {[key: string]: any} = this.getCurUser();

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.http.post('/api/user-link/findone', {
      id: Number(this.route.snapshot.params.id),
      user_id: this.curUser.id
    }).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        if (ri.code !== '1' || !ri.data.link) {
          alert(ri.msg);
          return this.router.navigate(['/user-link/list']);
        }
        this.fg = this.fb.group({
          id: [ri.data.link.id],
          title: [ri.data.link.title, [Validators.required]],
          href: [ri.data.link.href, [Validators.required, Validators.pattern(new RegExp('^https?://', 'i'))]],
          summary: [ri.data.link.summary],
          iconUrl: [ri.data.link.icon_url, [Validators.pattern(new RegExp('^https?://', 'i'))]],
          owner: [ri.data.link.user_id]
        });
        setTimeout(() => {
          $('.___js_readHrefInfo').tooltip();
        }, 1);
      }, 150);
    });
  }

  ngAfterViewInit(): void {
    $("#back-to-top").click();
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
    if (!this.curUser) this.router.navigate(['/home/user-link/list']);
  }

  onSubmit() {
    this.fg.disable();
    this.errMsg = null;
    let reqBody = Object.assign({}, this.fg.value);
    reqBody.id = this.fg.value.id;
    reqBody.icon_url = this.fg.value.iconUrl;
    this.http.post('/api/user-link/update', {
      id: this.fg.value.id,
      title: this.fg.value.title,
      href: this.fg.value.href,
      summary: this.fg.value.summary,
      icon_url: this.fg.value.iconUrl,
      user_id: this.fg.value.owner
    }).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        if (ri.code !== '1') {
          this.errMsg = ri.msg;
          this.fg.enable();
        } else history.back(); // this.router.navigate(['/home/user-link/list']);
      }, 150);
    });
  }

  get title(): AbstractControl | null {
    return this.fg.get('title');
  }

  get href(): AbstractControl | null {
    return this.fg.get('href');
  }

  get summary(): AbstractControl | null {
    return this.fg.get('summary');
  }

  get iconUrl(): AbstractControl | null {
    return this.fg.get('iconUrl');
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
  }

  readHrefInfoIsClicked = false;

  readHrefInfo() {
    this.readHrefInfoIsClicked = true;
    this.href.disable();
    this.http.post('/api/user-link/parse-link', {link: this.href.value}).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        this.href.enable();
        if (ri.code !== '1') return this.errMsg = ri.msg;
        let linkInfo = ri.data.link_info;
        this.title.setValue(linkInfo.title);
        this.summary.setValue(linkInfo.description + (linkInfo.description && linkInfo.keywords ? '\n\n' : '') + linkInfo.keywords);
        this.iconUrl.setValue(linkInfo.icon_url);
      }, 150);
    });
  }

}
