import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blackjack',
  standalone: false,
  templateUrl: './blackjack.component.html',
  styleUrl: './blackjack.component.scss'
})
export class BlackjackComponent {
  ayuda() {
    Swal.fire({
      title: "Cómo funciona?",
      text: "El blackjack es un juego en el que estas tú contra la casa (en este caso la máquina), se trata de juntar cartas hasta llegar a 21 o acercarse lo máximo posible, pero cuidado que si te pásas pierdes, la máquina debe pedir hasta tener 17, es decir con 16 pide y con 17 se queda",
      icon: "question",
      background: "#ffa"
    });
  }
}
