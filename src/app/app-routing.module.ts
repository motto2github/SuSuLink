import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./cpn/home/home.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'}
  , {path: 'home', redirectTo: 'home/all/', pathMatch: 'full'}
  , {path: 'home/all/:searchKeywords', component: HomeComponent}
  , {path: 'home/my/:searchKeywords', component: HomeComponent}
  , {path: '**', redirectTo: 'home/all/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
