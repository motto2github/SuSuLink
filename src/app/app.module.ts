import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {RootComponent} from './cpn/root/root.component';
import {HeaderComponent} from './cpn/header/header.component';
import {FooterComponent} from './cpn/footer/footer.component';
import {HomeComponent} from './cpn/home/home.component';
import { MarkToRedPipe } from './pipe/mark-to-red.pipe';

@NgModule({
  declarations: [
    RootComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MarkToRedPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule {
}
