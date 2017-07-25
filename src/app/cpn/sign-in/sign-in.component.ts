import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ssl-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private name: string;

  private password: string;

  constructor() {
  }

  ngOnInit() {
  }

}
