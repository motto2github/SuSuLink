import {Component, OnInit} from '@angular/core';
import 'jquery';

@Component({
  selector: 'ssl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    // [ back to top btn
    (function () {
      let $window = $(window), $back_to_top = $("#back-to-top"), $html_body = $("html, body");
      $window.scroll(function () {
        $(this).scrollTop() > 100 ? $back_to_top.fadeIn() : $back_to_top.fadeOut();
      });
      $back_to_top.click(function (e) {
        e.preventDefault();
        $html_body.animate({scrollTop: 0}, 300);
      });
    })();
    // ] back to top btn
  }

}
