import {Component, OnInit, DoCheck, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";

@Component({
  selector: 'ssl-user-link-add',
  templateUrl: './user-link-add.component.html',
  styleUrls: ['./user-link-add.component.css']
})
export class UserLinkAddComponent implements OnInit, DoCheck, AfterViewInit {

  private fg: FormGroup;

  private errMsg: string;

  private succMsg: string;

  private curUser: {[key: string]: any} = this.getCurUser();

  constructor(private fb: FormBuilder, private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    $("#back-to-top").click();
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
    if (!this.curUser) this.router.navigate(['/home/user-link/list']);
  }

  private initFormGroup() {
    this.fg = this.fb.group({
      title: ['', [Validators.required]],
      href: ['', [Validators.required, Validators.pattern(new RegExp('^https?://', 'i'))]],
      desc: ['']
    });
  }

  private submit() {
    this.fg.disable();
    this.errMsg = null;
    this.succMsg = null;
    this.http.post('/api/user-link/add', Object.assign({curUserId: this.curUser._id}, this.fg.value)).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        console.log(ri);
        if (ri.code !== 1) {
          this.errMsg = ri.msg;
          this.fg.enable();
        } else {
          this.succMsg = ri.msg;
          this.fg.reset();
          this.fg.enable();
        }
      }, 3000);
    });
  }

  private get title(): AbstractControl | null {
    return this.fg.get('title');
  }

  private get href(): AbstractControl | null {
    return this.fg.get('href');
  }

  private get desc(): AbstractControl | null {
    return this.fg.get('desc');
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(sessionStorage.getItem('__ssl_cur_user'));
  }

}