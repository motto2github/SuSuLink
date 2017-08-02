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

  private search_histories: Array<string>;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.keywords.setValue(this.route.snapshot.params.keywords);
    this.search_histories = JSON.parse(localStorage.getItem('__ssl_search_histories')) || [];
  }

  ngAfterViewInit(): void {
    $('.form-control').focus();
  }

  private onSubmit() {
    this.keywords.setValue(this.keywords.value.trim());
    if (this.keywords.value !== '') {
      this.search_histories = this.search_histories.filter(item => this.keywords.value !== item);
      this.search_histories.unshift(this.keywords.value);
      localStorage.setItem('__ssl_search_histories', JSON.stringify(this.search_histories));
    }
    this.router.navigate([`/home/${this.route.snapshot.params.category}/list`, this.keywords.value]);
  }

  private onHotItemClick(keywords) {
    this.keywords.setValue(keywords);
    this.onSubmit();
  }

  private onHistoryItemClick(keywords) {
    this.keywords.setValue(keywords);
    this.onSubmit();
  }

  private onClearHistoriesClick() {
    this.search_histories = [];
    localStorage.removeItem('__ssl_search_histories');
  }

}
