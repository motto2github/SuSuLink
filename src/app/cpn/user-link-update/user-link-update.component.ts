import {Component, OnInit, DoCheck, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ssl-user-link-update',
  templateUrl: './user-link-update.component.html',
  styleUrls: ['./user-link-update.component.css']
})
export class UserLinkUpdateComponent implements OnInit, DoCheck, AfterViewInit {

  private fg: FormGroup;

  private errMsg: string;

  private curUser: {[key: string]: any} = this.getCurUser();

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.http.post('/api/user-link/findone', {
      id: this.route.snapshot.params.id,
      userId: this.curUser._id
    }).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        if (ri.code !== 1 || !ri.data.link) {
          alert(ri.msg);
          return this.router.navigate(['/user-link/list']);
        }
        this.fg = this.fb.group({
          _id: [ri.data.link._id],
          title: [ri.data.link.title, [Validators.required]],
          href: [ri.data.link.href, [Validators.required, Validators.pattern(new RegExp('^https?://', 'i'))]],
          summary: [ri.data.link.summary],
          owner: [ri.data.link.owner]
        });
      }, 300);
    });
  }

  ngAfterViewInit(): void {
    $("#back-to-top").click();
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
    if (!this.curUser) this.router.navigate(['/home/user-link/list']);
  }

  private onSubmit() {
    this.fg.disable();
    this.errMsg = null;
    this.http.post('/api/user-link/update', this.fg.value).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        if (ri.code !== 1) {
          this.errMsg = ri.msg;
          this.fg.enable();
        } else history.back(); // this.router.navigate(['/home/user-link/list']);
      }, 300);
    });
  }

  private get title(): AbstractControl | null {
    return this.fg.get('title');
  }

  private get href(): AbstractControl | null {
    return this.fg.get('href');
  }

  private get summary(): AbstractControl | null {
    return this.fg.get('summary');
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
  }

}
