import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./cpn/home/home.component";
import {CommonLinkListComponent} from "./cpn/common-link-list/common-link-list.component";
import {UserLinkListComponent} from "./cpn/user-link-list/user-link-list.component";
import {SignUpComponent} from "./cpn/sign-up/sign-up.component";
import {SignInComponent} from "./cpn/sign-in/sign-in.component";
import {UserLinkAddComponent} from "./cpn/user-link-add/user-link-add.component";

const routes: Routes = [
  {path: '', redirectTo: 'home/common-link/list', pathMatch: 'full'}
  , {
    path: 'home', component: HomeComponent, children: [
      {path: 'common-link/list', redirectTo: 'common-link/list/', pathMatch: 'full'}
      , {path: 'common-link/list/:keywords', component: CommonLinkListComponent}
      , {path: 'user-link/list', redirectTo: 'user-link/list/', pathMatch: 'full'}
      , {path: 'user-link/list/:keywords', component: UserLinkListComponent}
    ]
  }
  , {path: 'sign-up', component: SignUpComponent}
  , {path: 'sign-in', component: SignInComponent}
  , {path: 'user-link/add', component: UserLinkAddComponent}
  , {path: '**', redirectTo: 'home/common-link/list', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
  , exports: [RouterModule]
})
export class AppRoutingModule {
}
