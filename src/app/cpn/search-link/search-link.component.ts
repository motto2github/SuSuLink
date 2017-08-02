import {Component, OnInit, AfterViewInit} from '@angular/core';
import 'jquery';
import {FormControl} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ssl-search-link',
  templateUrl: './search-link.component.html',
  styleUrls: ['./search-link.component.css']
})
export class SearchLinkComponent implements OnInit, AfterViewInit {

  private keywords: FormControl = new FormControl('');

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.keywords.setValue(this.route.snapshot.params.keywords);
  }

  ngAfterViewInit(): void {
    $('.form-control').focus();
  }

  private onSubmit() {
    this.router.navigate([`/home/${this.route.snapshot.params.category}/list`, this.keywords.value]);
  }

}
