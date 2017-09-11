import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SignUpComponent} from "./cpn/sign-up/sign-up.component";
import {SignInComponent} from "./cpn/sign-in/sign-in.component";
import {HomeComponent} from "./cpn/home/home.component";
import {CommonLinkListComponent} from "./cpn/common-link-list/common-link-list.component";
import {UserLinkListComponent} from "./cpn/user-link-list/user-link-list.component";
import {UserLinkInsertComponent} from "./cpn/user-link-insert/user-link-insert.component";
import {UserLinkUpdateComponent} from "./cpn/user-link-update/user-link-update.component";
import {SearchLinkComponent} from "./cpn/search-link/search-link.component";
import {ResetPasswordComponent} from "./cpn/reset-password/reset-password.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'}
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
  , {path: 'reset-password', component: ResetPasswordComponent}
  , {path: 'user-link/insert', component: UserLinkInsertComponent}
  , {path: 'user-link/update/:id', component: UserLinkUpdateComponent}
  , {path: 'search-link/:category', redirectTo: 'search-link/:category/', pathMatch: 'full'}
  , {path: 'search-link/:category/:keywords', component: SearchLinkComponent}
  , {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
  , exports: [RouterModule]
})
export class AppRoutingModule {
}
