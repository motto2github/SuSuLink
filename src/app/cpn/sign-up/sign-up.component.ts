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
      password1: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      password2: ['', Validators.required]
    }, {validator: this.passwordNotEqualValidator});
  }

  private onSubmit() {
    console.log('submit...', this.fg.value);
    this.submitted = true;
    this.fg.disable();
    this.errMsg = null;
    this.http.post('/api/sign/up', this.fg.value).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        console.log(ri);
        if (ri.code === 1) {
          this.signUpSuccess = true;
          this.startCountDown();
        } else {
          this.submitted = false;
          this.fg.enable();
          this.errMsg = ri.msg;
        }
      }, 3000);
    });
  }

  private passwordNotEqualValidator(fg: AbstractControl): {[key: string]: any} {
    const pw1 = fg.get('password1').value;
    const pw2 = fg.get('password2').value;
    return pw1 === pw2 ? null : {passwordNotEqual: true};
  }

  get name() {
    return this.fg.get('name');
  }

  get password1() {
    return this.fg.get('password1');
  }

  get password2() {
    return this.fg.get('password2');
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
