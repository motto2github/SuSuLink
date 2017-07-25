import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AppRoutingModule} from './app-routing.module';
import {RootComponent} from './cpn/root/root.component';
import {HeaderComponent} from './cpn/header/header.component';
import {FooterComponent} from './cpn/footer/footer.component';
import {HomeComponent} from './cpn/home/home.component';
import {MarkToRedPipe} from './pipe/mark-to-red.pipe';
import {HomeListAllComponent} from './cpn/home-list-all/home-list-all.component';
import {HomeListMyComponent} from './cpn/home-list-my/home-list-my.component';
import {HttpModule} from "@angular/http";
import {SignUpComponent} from "./cpn/sign-up/sign-up.component";
import { SignInComponent } from './cpn/sign-in/sign-in.component';

@NgModule({
  declarations: [
    RootComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MarkToRedPipe,
    HomeListAllComponent,
    HomeListMyComponent,
    SignUpComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule {
}
