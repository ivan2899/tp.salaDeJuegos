import { Component } from '@angular/core';
import { CartasService } from '../../../services/cartas.service';
import { MessagesService } from '../../../services/messages.service';
import { SupabaseService } from '../../../services/supabase.service';

interface Carta {
  image: string;
  value: string;
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
  mostrandoCreditos: boolean = true;

  vidas: number = 3;
  deckId: string = '';
  resultado: string | null = null;

  rondasJugadas: number = 0;
  maxRondas: number = 2;

  cartaOculta: string = 'https://winlvopnawvcvyavuxcj.supabase.co/storage/v1/object/public/images/games/mayormenor/carBlue.png';

  constructor(private cartasService: CartasService, private messagesService: MessagesService, private supabaseService: SupabaseService) { }

  confirmarCreditos() {
    if (this.creditosApostados != 0) {

      if (!this.creditosApostados || this.creditosApostados > this.creditos) {
        this.messagesService.errorMessage('Créditos insuficientes', `No puedes apostar más créditos de los que tienes, tienes ${this.creditos} créditos`)
        return;
      }
      this.mostrandoCreditos = false;
      this.iniciarPartida();
    }
    else {
      this.messagesService.errorMessage('Créditos bajos', `No puedes apostar 0 créditos`)
    }
  }

  iniciarPartida() {
    if (this.rondasJugadas >= this.maxRondas || this.creditos <= 0) {
      this.messagesService.endGame('Juego terminado', `Se han jugado ${this.rondasJugadas} rondas. Créditos finales: ${this.creditos}`)
      this.supabaseService.gameLog(this.creditos, 'Blackjack');
      return;
    }

    this.jugador = [];
    this.crupier = [];
    this.crupierOculta = true;
    this.turnoUsuario = false;

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

        const puntosIniciales = this.calcularPuntos(this.jugador);
        if (puntosIniciales === 21) {
          this.turnoUsuario = false;
          this.crupierOculta = false;
          this.turnoCrupier(true);
        }
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

  async finalizarPartida() {
    const puntosJugador = this.calcularPuntos(this.jugador);
    const puntosCrupier = this.calcularPuntos(this.crupier);

    await new Promise(res => setTimeout(res, 3000));

    if (puntosJugador > 21 || (puntosJugador < puntosCrupier && puntosCrupier <= 21)) {
      this.creditos -= this.creditosApostados;
      this.vidas--;
      this.messagesService.wrongAnswer(`Vidas restantes: ${this.vidas}`)
    } else if (puntosJugador > puntosCrupier || puntosCrupier > 21) {
      this.creditos += this.creditosApostados;
      this.messagesService.succesMessage('¡Ganaste!', `Créditos actuales: ${this.creditos}`)
    } else {
      this.messagesService.equalMessage('Empate 🤝', `Créditos actuales: ${this.creditos}`);
    }

    this.rondasJugadas++;

    if (this.vidas > 0 && this.rondasJugadas < this.maxRondas && this.creditos > 0) {
      this.creditosApostados = 0;
      this.mostrandoCreditos = true;
    } else {
      const isConfirmed = await this.messagesService.endGame('Juego terminado', `Se jugaron todas las rondas permitidas, créditos finales: ${this.creditos}`)
      this.supabaseService.gameLog(this.creditos, 'Blackjack');

      if (isConfirmed) {
        this.reiniciarJuego();
      }
    }
  }

  reiniciarJuego() {
    this.creditos = 20;
    this.vidas = 3;
    this.rondasJugadas = 0;
    this.creditosApostados = 0;
    this.mostrandoCreditos = true;
    this.resultado = null;
  }

  calcularPuntos(mano: Carta[], ocultarSegunda: boolean = false): number {
    let total = 0;
    let ases = 0;
    mano.forEach((carta, i) => {
      if (ocultarSegunda && i === 1) return;
      const valor = carta.value;
      if (['KING', 'QUEEN', 'JACK'].includes(valor)) total += 10;
      else if (valor === 'ACE') { ases++; total += 11; }
      else total += Number(valor);
    });
    while (total > 21 && ases > 0) { total -= 10; ases--; }
    return total;
  }

  private cartaConAnimacion(carta: any, tipo: 'jugador' | 'crupier'): Carta {
    const c: Carta = { image: carta.image, value: carta.value, animando: true, tipo };
    setTimeout(() => c.animando = false, 500);
    return c;
  }

  ayuda() {
    this.messagesService.helpMessage('Blackjack: llega a 21 sin pasarte. Cada ronda apuestas créditos, si pierdes pierdes una vida.');
  }

  creditosMax(){
    this.creditosApostados = this.creditos;
  }
}