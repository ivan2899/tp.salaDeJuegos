import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { AhorcadoComponent } from './components/games/ahorcado/ahorcado.component';
import { PreguntadosComponent } from './components/games/preguntados/preguntados.component';
import { MayorMenorComponent } from './components/games/mayor-menor/mayor-menor.component';
import { BlackjackComponent } from './components/games/blackjack/blackjack.component';
import { JuegosComponent } from './components/juegos/juegos.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    {
        path: 'juegos', component: JuegosComponent,
        children:
            [
                {
                    path: "ahorcado", component: AhorcadoComponent
                },
                {
                    path: "preguntados", component: PreguntadosComponent
                },
                {
                    path: "mayormenor", component: MayorMenorComponent
                },
                {
                    path: "blackjack", component: BlackjackComponent
                }
            ]
    },
    { path: 'about', component: AboutMeComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: PageNotFoundComponent }

];
