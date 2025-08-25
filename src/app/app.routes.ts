import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutMeComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: PageNotFoundComponent }

];
