import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CartasService } from '../../../services/cartas.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {

  deckId!: string;
  cartaVisible: any = null;  // carta que se ve con imagen
  cartaOculta: any = null;   // carta solo texto (valor real pero no se muestra imagen)
  puntos: number = 0;

  constructor(private cartasService: CartasService) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.cartasService.crearMazo().subscribe(res => {
      this.deckId = res.deck_id;
      this.obtenerCartas(true);
    });
  }

  obtenerCartas(inicial: boolean = false) {
  const cantidad = inicial ? 2 : 1;

  this.cartasService.sacarCartas(this.deckId, cantidad).subscribe(res => {
    if (inicial) {
      // primera vez: saco 2
      this.cartaVisible = res.cards[0];
      this.cartaOculta = res.cards[1];
    } else {
      // después de cada jugada: saco 1
      this.cartaVisible = this.cartaOculta; // la anterior oculta ahora es visible
      this.cartaOculta = res.cards[0];      // la nueva es oculta
    }

    // cuando ya no quedan cartas
    if (res.remaining === 0) {
            Swal.fire({
        title: '🏁 Terminaste el mazo',
        text: `Tus puntos totales son: ${this.puntos}`,
        icon: 'info',
        background: "#ffa",
        showCancelButton: false,
        confirmButtonText: '🔄 Reiniciar juego',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.puntos = 0;        // reinicio puntaje
          this.iniciarJuego();    // arranco nuevo mazo
        }
      });
    }
  });
}

  // 🔹 Traducción palo en texto
  getDescripcionCarta(carta: any): string {
    const palos: any = {
      HEARTS: 'corazones',
      SPADES: 'picas',
      DIAMONDS: 'diamantes',
      CLUBS: 'tréboles'
    };
    return `${carta.value} de ${palos[carta.suit]}`;
  }

  // 🔹 Convertir valor de carta a número
  private getValorNumerico(carta: any): number {
    const valores: any = {
      'ACE': 14,
      'JACK': 11,
      'QUEEN': 12,
      'KING': 13
    };
    return valores[carta.value] || parseInt(carta.value, 10);
  }

  elegirMayor() {
    const valorVisible = this.getValorNumerico(this.cartaVisible);
    const valorOculta = this.getValorNumerico(this.cartaOculta);

    if (valorOculta > valorVisible) {
      Swal.fire('🎉 Acertaste!', 'La carta oculta era mayor, sumas 1 punto', 'success');
      this.puntos++;
    } else if (valorOculta < valorVisible) {
      Swal.fire('😢 Fallaste', 'La carta oculta era menor, restas un punto', 'error');
      if(this.puntos > 0) {this.puntos--;}
    } else {
      Swal.fire('😎 Empate', 'Las cartas tienen el mismo valor, seguís en juego', 'info');
    }

    this.obtenerCartas(); // sacar nuevas cartas
  }

  elegirMenor() {
    const valorVisible = this.getValorNumerico(this.cartaVisible);
    const valorOculta = this.getValorNumerico(this.cartaOculta);

    if (valorOculta < valorVisible) {
      Swal.fire('🎉 Acertaste!', 'La carta oculta era menor, sumas 1 punto', 'success');
      this.puntos++;
    } else if (valorOculta > valorVisible) {
      Swal.fire('😢 Fallaste', 'La carta oculta era mayor, restas un punto', 'error');
      if(this.puntos > 0) {this.puntos--;}
    } else {
      Swal.fire('😎 Empate', 'Las cartas tienen el mismo valor, seguís en juego', 'info');
    }

    this.obtenerCartas(); // sacar nuevas cartas
  }

  ayuda() {
    Swal.fire({
      title: "Cómo funciona?",
      text: "Mayor o menor es un juego en el que deberás adivinar si la carta que está volteada es mayor o menor a tu carta visible. Si aciertas, sumás puntos; si no, restás.",
      icon: "question",
      background: "#ffa"
    });
  }
}
