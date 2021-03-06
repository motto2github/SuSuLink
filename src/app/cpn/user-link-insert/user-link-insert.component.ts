import {Component, OnInit, DoCheck, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";

@Component({
  selector: 'ssl-user-link-insert',
  templateUrl: './user-link-insert.component.html',
  styleUrls: ['./user-link-insert.component.css']
})
export class UserLinkInsertComponent implements OnInit, DoCheck, AfterViewInit {

  fg: FormGroup;

  errMsg: string;

  succMsg: string;

  curUser: {[key: string]: any} = this.getCurUser();

  constructor(private fb: FormBuilder, private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    $("#back-to-top").click();
    $('#href').focus();
    $('.___js_readHrefInfo').tooltip();
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
    if (!this.curUser) this.router.navigate(['/home/user-link/list']);
  }

  private initFormGroup() {
    this.fg = this.fb.group({
      title: ['', [Validators.required]],
      href: ['', [Validators.required, Validators.pattern(new RegExp('^https?://', 'i'))]],
      summary: [''],
      iconUrl: ['', [Validators.pattern(new RegExp('^https?://', 'i'))]]
    });
  }

  onSubmit() {
    this.fg.disable();
    this.errMsg = null;
    this.succMsg = null;
    this.http.post('/api/user-link/insert', Object.assign({curUserId: this.curUser._id}, this.fg.value)).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        if (ri.code !== 1) {
          this.errMsg = ri.msg;
          this.fg.enable();
        } else {
          this.succMsg = ri.msg;
          this.fg.reset();
          this.fg.enable();
        }
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

  readHrefInfo() {
    if (this.href.invalid) return;
    this.href.disable();
    this.http.post('/api/link/parse', {link: this.href.value}).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        this.href.enable();
        if (ri.code !== 1) return this.errMsg = ri.msg;
        this.title.setValue(ri.data.title);
        this.summary.setValue(ri.data.description + (ri.data.description && ri.data.keywords ? '\n\n' : '') + ri.data.keywords);
        this.iconUrl.setValue(ri.data.iconUrl);
      }, 150);
    });
  }

}
