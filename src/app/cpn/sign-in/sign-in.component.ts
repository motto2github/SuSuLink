import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Http} from "@angular/http";

@Component({
  selector: 'ssl-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private fg: FormGroup;

  private signInSuccess: boolean = false;

  private errMsg: string;

  constructor(private fb: FormBuilder, private http: Http) {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  private initFormGroup() {
    this.fg = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]]
    });
  }

  private onSubmit() {
    console.log('submit...', this.fg.value);
    this.fg.disable();
    this.errMsg = null;
    this.http.post('/api/sign/in', this.fg.value).map(res => res.json()).subscribe(ri => {
      setTimeout(() => {
        console.log(ri);
        if (ri.code === 1) {
          this.signInSuccess = true;
        } else {
          this.fg.enable();
          this.errMsg = ri.msg;
        }
      }, 3000);
    });
  }

  get name() {
    return this.fg.get('name');
  }

  get password() {
    return this.fg.get('password');
  }

}
