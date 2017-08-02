import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {MarkToRedPipe} from './pipe/mark-to-red.pipe';

import {AppRoutingModule} from './app-routing.module';

import {RootComponent} from './cpn/root/root.component';
import {HeaderComponent} from './cpn/header/header.component';
import {FooterComponent} from './cpn/footer/footer.component';
import {SignUpComponent} from "./cpn/sign-up/sign-up.component";
import {SignInComponent} from './cpn/sign-in/sign-in.component';
import {HomeComponent} from './cpn/home/home.component';
import {CommonLinkListComponent} from './cpn/common-link-list/common-link-list.component';
import {UserLinkListComponent} from './cpn/user-link-list/user-link-list.component';
import {UserLinkInsertComponent} from './cpn/user-link-insert/user-link-insert.component';
import {UserLinkUpdateComponent} from './cpn/user-link-update/user-link-update.component';
import { SearchLinkComponent } from './cpn/search-link/search-link.component';

@NgModule({
  declarations: [
    RootComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MarkToRedPipe,
    CommonLinkListComponent,
    UserLinkListComponent,
    SignUpComponent,
    SignInComponent,
    UserLinkInsertComponent,
    UserLinkUpdateComponent,
    SearchLinkComponent
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
