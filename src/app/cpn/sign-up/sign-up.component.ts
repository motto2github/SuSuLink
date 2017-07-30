import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {Http} from "@angular/http";
import {Router} from "@angular/router";

@Component({
  selector: 'ssl-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private fg: FormGroup;

  private submitted: boolean = false;

  private signUpSuccess: boolean = false;

  private errMsg: string;

  constructor(private fb: FormBuilder, private http: Http, private router: Router) {
    this.initFormGroup();
  }

  ngOnInit() {
  }

  private initFormGroup() {
    this.fg = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordNotEqualValidator});
  }

  private onSubmit() {
    this.submitted = true;
    this.fg.disable();
    this.errMsg = null;
    this.http.post('/api/sign/up', this.fg.value).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        if (ri.code === 1) {
          this.signUpSuccess = true;
          this.startCountDown();
        } else {
          this.submitted = false;
          this.fg.enable();
          this.errMsg = ri.msg;
        }
      }, 1000);
    });
  }

  private passwordNotEqualValidator(fg: AbstractControl): {[key: string]: any} {
    const pw1 = fg.get('password').value;
    const pw2 = fg.get('confirmPassword').value;
    return pw1 === pw2 ? null : {passwordNotEqual: true};
  }

  private get name(): AbstractControl | null {
    return this.fg.get('name');
  }

  private get password(): AbstractControl | null {
    return this.fg.get('password');
  }

  private get confirmPassword(): AbstractControl | null {
    return this.fg.get('confirmPassword');
  }

  private countDown: number;

  private countDownInterval: any;

  private startCountDown() {
    this.countDown = 5;
    this.countDownInterval = setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        this.router.navigate(['/sign/in']);
      }
    }, 1000);
  }

  private stopCountDown() {
    this.countDown = 5;
    clearInterval(this.countDownInterval);
  }

}
