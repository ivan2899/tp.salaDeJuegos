import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(c => LoginComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(c => HomeComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./components/about-me/about-me.component').then(c => AboutMeComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(c => RegisterComponent)
    },
    {
        path: 'juegos',
        loadChildren: () => import('./modulos/juegos/juegos.module').then(m => m.JuegosModule)
    },
    {
        path: 'encuesta',
        loadComponent: () => import('./components/survey/survey.component').then(m => m.SurveyComponent)
    },
    { path: '**', component: PageNotFoundComponent }

];
