import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ssl-search-link',
  templateUrl: './search-link.component.html',
  styleUrls: ['./search-link.component.css']
})
export class SearchLinkComponent implements OnInit, AfterViewInit {

  keywords: FormControl = new FormControl('');

  search_histories: Array<string>;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.keywords.setValue(this.route.snapshot.params.keywords);
    this.search_histories = JSON.parse(localStorage.getItem('__ssl_search_histories')) || [];
  }

  ngAfterViewInit(): void {
    $('.form-control').focus();
  }

  onSubmit() {
    let keywordsValue = this.keywords.value.trim();
    this.keywords.setValue(keywordsValue, {emitEvent: false});
    if (keywordsValue !== '') {
      this.search_histories = this.search_histories.filter(item => keywordsValue !== item);
      this.search_histories.unshift(keywordsValue);
      localStorage.setItem('__ssl_search_histories', JSON.stringify(this.search_histories));
    }
    this.router.navigate([`/home/${this.route.snapshot.params.category}/list`, keywordsValue]);
  }

  onHotItemClick(keywords) {
    this.keywords.setValue(keywords);
    this.onSubmit();
  }

  onHistoryItemClick(keywords) {
    this.keywords.setValue(keywords);
    this.onSubmit();
  }

  onClearHistoriesClick() {
    this.search_histories = [];
    localStorage.removeItem('__ssl_search_histories');
  }

  onBack() {
    let keywordsValue = this.keywords.value.trim();
    this.keywords.setValue(keywordsValue, {emitEvent: false});
    if (keywordsValue === '') this.onSubmit();
    else history.back();
  }

}
