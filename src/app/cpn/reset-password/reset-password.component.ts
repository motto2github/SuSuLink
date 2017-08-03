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

  private fg: FormGroup;

  private submitted: boolean = false;

  private resetSuccess: boolean = false;

  private errMsg: string;

  private curUser: {[key: string]: any} = this.getCurUser();

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

  private onSubmit() {
    this.submitted = true;
    this.fg.disable();
    this.errMsg = null;
    setTimeout(() => {
      this.http.post('/api/reset-password', Object.assign({userId: this.curUser._id}, this.fg.value)).map(res => res.json()).subscribe(ri => {
        if (ri.code === 1) {
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
    }, 300);
  }

  private passwordNotEqualValidator(fg: AbstractControl): {[key: string]: any} {
    const pw1 = fg.get('newPassword').value;
    const pw2 = fg.get('confirmNewPassword').value;
    return pw1 === pw2 ? null : {passwordNotEqual: true};
  }

  private get oldPassword(): AbstractControl | null {
    return this.fg.get('oldPassword');
  }

  private get newPassword(): AbstractControl | null {
    return this.fg.get('newPassword');
  }

  private get confirmNewPassword(): AbstractControl | null {
    return this.fg.get('confirmNewPassword');
  }

  private countDown: number;

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

  private stopCountDown() {
    this.countDown = 5;
    clearInterval(this.countDownInterval);
  }

  private getCurUser(): {[key: string]: any} {
    return JSON.parse(localStorage.getItem('__ssl_cur_user') || sessionStorage.getItem('__ssl_cur_user'));
  }

}
