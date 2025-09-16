import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {

  ayuda() {
      Swal.fire({
        title: "Cómo funciona?",
        text: "Mayor o menor es un juego en el que deberás adivinar si la carta que está volteada es mayor o menor a tu carta (la que tienes visible) en el caso de que aciertes, continuas jugando hasta que no logres acertar",
        icon: "question",
        background: "#ffa"
      });
    }
}
