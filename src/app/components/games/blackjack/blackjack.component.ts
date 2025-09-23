import { Component } from '@angular/core';
import { CartasService } from '../../../services/cartas.service';
import Swal from 'sweetalert2';

interface Carta {
  image: string;
  value: string; // la API devuelve string tipo "KING", "5", "ACE"
  animando?: boolean;
  tipo?: 'jugador' | 'crupier';
}

@Component({
  selector: 'app-blackjack',
  standalone: false,
  templateUrl: './blackjack.component.html',
  styleUrl: './blackjack.component.scss'
})
export class BlackjackComponent {
   jugador: Carta[] = [];
  crupier: Carta[] = [];
  crupierOculta: boolean = true;
  turnoUsuario: boolean = false;

  creditos: number = 20;
  creditosApostados: number = 0;
  creditosTemp: number = 0;
  mostrandoCreditos: boolean = true;

  deckId: string = '';

  // Nuevo → estado final de partida
  resultado: string | null = null;

  constructor(private cartasService: CartasService) {}

  confirmarCreditos() {
    if (this.creditos == 0 || ((this.creditos - this.creditosApostados) < 0)) {return};
    this.creditosTemp = (this.creditos - this.creditosApostados)
    this.mostrandoCreditos = false;
    this.iniciarPartida();
  }

  iniciarPartida() {
    this.jugador = [];
    this.crupier = [];
    this.crupierOculta = true;
    this.turnoUsuario = false;
    this.resultado = null;

    this.cartasService.crearMazo().subscribe((res: any) => {
      this.deckId = res.deck_id;
      this.repartirInicial();
    });
  }

  repartirInicial() {
    this.cartasService.sacarCartas(this.deckId, 4).subscribe((res: any) => {
      const [c1, c2, c3, c4] = res.cards;
      this.jugador.push(this.cartaConAnimacion(c1, 'jugador'));
      setTimeout(() => this.crupier.push(this.cartaConAnimacion(c2, 'crupier')), 400);
      setTimeout(() => this.jugador.push(this.cartaConAnimacion(c3, 'jugador')), 800);
      setTimeout(() => {
        this.crupier.push(this.cartaConAnimacion(c4, 'crupier'));
        this.turnoUsuario = true;
      }, 1200);
    });
  }

  pedirCarta() {
    if (!this.turnoUsuario) return;
    this.cartasService.sacarCartas(this.deckId, 1).subscribe((res: any) => {
      const carta = this.cartaConAnimacion(res.cards[0], 'jugador');
      this.jugador.push(carta);

      if (this.calcularPuntos(this.jugador) > 21) {
        this.turnoUsuario = false;
        this.crupierOculta = false;
        this.turnoCrupier(true);
      }
    });
  }

  plantarse() {
    this.turnoUsuario = false;
    this.crupierOculta = false;
    this.turnoCrupier();
  }

  turnoCrupier(forzarFinal: boolean = false) {
    const loop = () => {
      if (this.calcularPuntos(this.crupier) < 17 && !forzarFinal) {
        this.cartasService.sacarCartas(this.deckId, 1).subscribe((res: any) => {
          this.crupier.push(this.cartaConAnimacion(res.cards[0], 'crupier'));
          setTimeout(loop, 800);
        });
      } else {
        this.finalizarPartida();
      }
    };
    loop();
  }

  finalizarPartida() {
    const puntosJugador = this.calcularPuntos(this.jugador);
    const puntosCrupier = this.calcularPuntos(this.crupier);

    setTimeout(() => {
      if (puntosJugador > 21) {
        this.resultado = 'Te pasaste 😢';
        this.creditos -= this.creditosApostados;
      } else if (puntosCrupier > 21 || puntosJugador > puntosCrupier) {
        this.resultado = 'Ganaste 🎉';
        this.creditos += (this.creditosApostados * 2);
      } else if (puntosJugador < puntosCrupier) {
        this.resultado = 'Perdiste 😢';
        this.creditos -= this.creditosApostados;
      } else {
        this.resultado = 'Empate 🤝';
        this.creditos += this.creditosApostados;
      }
    }, 2000);
  }

  calcularPuntos(mano: Carta[], ocultarSegunda: boolean = false): number {
    let total = 0;
    let ases = 0;

    mano.forEach((carta, i) => {
      if (ocultarSegunda && i === 1) return; // no cuenta la carta oculta
      let valor = carta.value;
      if (['KING', 'QUEEN', 'JACK'].includes(valor)) {
        total += 10;
      } else if (valor === 'ACE') {
        ases++;
        total += 11;
      } else {
        total += Number(valor);
      }
    });

    while (total > 21 && ases > 0) {
      total -= 10;
      ases--;
    }

    return total;
  }

  seguirJugando() {
    if (this.creditos > 0) {
      this.iniciarPartida();
    } else {
      this.resultado = 'Te quedaste sin créditos 💸';
    }
  }

  private cartaConAnimacion(carta: any, tipo: 'jugador' | 'crupier'): Carta {
    const c: Carta = { image: carta.image, value: carta.value, animando: true, tipo };
    setTimeout(() => c.animando = false, 500);
    return c;
  }

   ayuda() {
    Swal.fire({
      title: "Cómo funciona?",
      text: "El blackjack es un juego en el que estas tú contra la casa (en este caso la máquina), se trata de juntar cartas hasta llegar a 21 o acercarse lo máximo posible, pero cuidado que si te pásas pierdes, la máquina debe pedir hasta tener 17, es decir con 16 pide y con 17 se queda",
      icon: "question",
      background: "#ffa"
    });
  }
}