import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'ssl-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private fg: FormGroup;

  constructor(private fb: FormBuilder) {
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
  }

  get name() {
    return this.fg.get('name');
  }

  get password() {
    return this.fg.get('password');
  }

}
