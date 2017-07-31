import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import 'jquery';

@Component({
  selector: 'ssl-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, AfterViewInit {

  private fg: FormGroup;

  private errMsg: string;

  constructor(private fb: FormBuilder, private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    $("#back-to-top").click();
  }

  private initFormGroup() {
    this.fg = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });
  }

  private onSubmit() {
    this.fg.disable();
    this.errMsg = null;
    this.http.post('/api/sign-in', this.fg.value).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        if (ri.code === 1) {
          sessionStorage.setItem('__ssl_cur_user', JSON.stringify(ri.data.user));
          this.router.navigate(['/home/user-link/list']);
        } else {
          this.fg.enable();
          this.errMsg = ri.msg;
        }
      }, 1000);
    });
  }

  private get name(): AbstractControl | null {
    return this.fg.get('name');
  }

  private get password(): AbstractControl | null {
    return this.fg.get('password');
  }

}
