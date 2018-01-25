import {Component, OnInit, AfterViewInit, DoCheck} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Component({
  selector: 'ssl-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit, DoCheck {

  fg: FormGroup;

  submitted: boolean = false;

  resetSuccess: boolean = false;

  errMsg: string;

  curUser: {[key: string]: any} = this.getCurUser();

  constructor(private fb: FormBuilder, private http: Http, private router: Router) {
    this.initFormGroup();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    $('#back-to-top').click();
    $('#oldPassword').focus();
  }

  ngDoCheck(): void {
    this.curUser = this.getCurUser();
  }

  private initFormGroup() {
    this.fg = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirmNewPassword: ['', Validators.required]
    }, {validator: this.passwordNotEqualValidator});
  }

  onSubmit() {
    this.submitted = true;
    this.fg.disable();
    this.errMsg = null;
    // setTimeout(() => {
      this.http.post('/api/user/reset-password', {
        user_id: this.curUser.id,
        old_password: this.fg.value.oldPassword,
        new_password: this.fg.value.newPassword
      }).map(res => res.json()).subscribe(ri => {
        if (ri.code === '1') {
          localStorage.removeItem('__ssl_cur_user');
          sessionStorage.removeItem('__ssl_cur_user');
          this.resetSuccess = true;
          this.startCountDown();
        } else {
          this.submitted = false;
          this.fg.enable();
          this.errMsg = ri.msg;
        }
      });
    // }, 300);
  }

  private passwordNotEqualValidator(fg: AbstractControl): {[key: string]: any} {
    const pw1 = fg.get('newPassword').value;
    const pw2 = fg.get('confirmNewPassword').value;
    return pw1 === pw2 ? null : {passwordNotEqual: true};
  }

  get oldPassword(): AbstractControl | null {
    return this.fg.get('oldPassword');
  }

  get newPassword(): AbstractControl | null {
    return this.fg.get('newPassword');
  }

  get confirmNewPassword(): AbstractControl | null {
    return this.fg.get('confirmNewPassword');
  }

  countDown: number;

  private countDownInterval: any;

  private startCountDown() {
    this.countDown = 5;
    this.countDownInterval = setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        this.router.navigate(['/sign-in']);
      }
    }, 1000);
  }

  stopCountDown() {
    this.countDown = 5;
    clearInterval(this.countDownInterval);
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
  }

}
