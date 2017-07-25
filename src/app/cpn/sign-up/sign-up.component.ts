import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ssl-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  private name: string;

  private password1: string;

  private password2: string;

  constructor() {
  }

  ngOnInit() {
  }

}
