import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Guards
import { AuthGuard } from './services/auth.guard';

//components
import { LoginComponent } from './components/login.component';
import { ProfileComponent } from './components/profile.component';
import { HomeComponent } from './components/home.component';


const routes: Routes = [
  {path: 'login', canActivate:[AuthGuard], component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], children: [
    {path: 'home', canActivate: [AuthGuard], component: HomeComponent},
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: '**', pathMatch: 'full', redirectTo: 'home'},
  ]},
  {path: '', pathMatch: "full", redirectTo: 'login'},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
