import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";

@Component({
  selector: 'ssl-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private fg: FormGroup;

  constructor(private fb: FormBuilder) {
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

}
