import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./cpn/home/home.component";
import { HomeListAllComponent } from "./cpn/home-list-all/home-list-all.component";
import { HomeListMyComponent } from "./cpn/home-list-my/home-list-my.component";
import { SignUpComponent } from "./cpn/sign-up/sign-up.component";
import { SignInComponent } from "./cpn/sign-in/sign-in.component";
import { LinkAddComponent } from "./cpn/link-add/link-add.component";

const routes: Routes = [
  { path: '', redirectTo: 'home/all/', pathMatch: 'full' }
  , {
    path: 'home', component: HomeComponent, children: [
      { path: 'all', redirectTo: 'all/', pathMatch: 'full' }
      , { path: 'all/:keywords', component: HomeListAllComponent }
      , { path: 'my', redirectTo: 'my/', pathMatch: 'full' }
      , { path: 'my/:keywords', component: HomeListMyComponent }
    ]
  }
  , { path: 'sign/up', component: SignUpComponent }
  , { path: 'sign/in', component: SignInComponent }
  , { path: 'link/add', component: LinkAddComponent }
  , { path: '**', redirectTo: 'home/all/', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot( routes ) ]
  , exports: [ RouterModule ]
})
export class AppRoutingModule {}
