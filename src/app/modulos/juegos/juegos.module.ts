import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from '../../components/games/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../../components/games/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from '../../components/games/preguntados/preguntados.component';
import { BlackjackComponent } from '../../components/games/blackjack/blackjack.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AhorcadoComponent, MayorMenorComponent, PreguntadosComponent, BlackjackComponent],
  imports: [
    CommonModule,
    JuegosRoutingModule,
    RouterLink,
    FormsModule,
    HttpClientModule
  ]
})
export class JuegosModule { }
