import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from '../../components/games/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../../components/games/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../../components/games/preguntados/preguntados.component';
import { BlackjackComponent } from '../../components/games/blackjack/blackjack.component';

const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayormenor', component: MayorMenorComponent },
  { path: 'preguntados', component: PreguntadosComponent },
  { path: 'blackjack', component: BlackjackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
