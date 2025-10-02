import { Component } from '@angular/core';
import { CartasService } from '../../../services/cartas.service';
import { MessagesService } from '../../../services/messages.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {

  deckId!: string;
  cartaVisible: any = null;
  cartaOculta: any = null;
  puntos: number = 0;
  vidas: number = 3;
  reiniciar: boolean = false;

  constructor(private cartasService: CartasService, private messagesService: MessagesService, private supabaseService: SupabaseService) { }

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

    this.cartasService.sacarCartas(this.deckId, cantidad).subscribe(async res => {
      if (inicial) {
        this.cartaVisible = res.cards[0];
        this.cartaOculta = res.cards[1];
      } else {
        this.cartaVisible = this.cartaOculta;
        this.cartaOculta = res.cards[0];
      }

      if (res.remaining === 0) {
        const reiniciar = await this.messagesService.endGame(
          '🏁 Terminaste el mazo',
          `Tus puntos totales son: ${this.puntos}`
        );
        this.supabaseService.gameLog(this.puntos, 'MayorMenor');

        if (reiniciar) this.iniciarJuego();
      }
    });
  }

  getDescripcionCarta(carta: any): string {
    const palos: any = {
      HEARTS: 'corazones',
      SPADES: 'picas',
      DIAMONDS: 'diamantes',
      CLUBS: 'tréboles'
    };
    return `${carta.value} de ${palos[carta.suit]}`;
  }

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
      this.messagesService.succesMessage('🎉 Acertaste!', 'La carta oculta era mayor, sumas 1 punto');
      this.puntos++;
    } else if (valorOculta < valorVisible) {
      this.perderVida();
      if (this.puntos > 0) { this.puntos--; }
    } else {
      this.messagesService.equalMessage('😎 Empate', 'Las cartas tienen el mismo valor, seguís en juego');

    }
    this.obtenerCartas();
  }

  elegirMenor() {
    const valorVisible = this.getValorNumerico(this.cartaVisible);
    const valorOculta = this.getValorNumerico(this.cartaOculta);

    if (valorOculta < valorVisible) {
      this.messagesService.succesMessage('🎉 Acertaste!', 'La carta oculta era menor, sumas 1 punto');
      this.puntos++;
    } else if (valorOculta > valorVisible) {
      this.perderVida();
    } else {
      this.messagesService.equalMessage('😎 Empate', 'Las cartas tienen el mismo valor, seguís en juego');
    }
    this.obtenerCartas();
  }

  private async perderVida() {
    if (this.vidas > 1) {
      this.vidas--;
      this.messagesService.wrongAnswer(`Pierdes una vida. Vidas restantes: ${this.vidas}`);
    } else {
      const reiniciar = await this.messagesService.endGame(
        '💀 GAME OVER',
        `Te quedaste sin vidas. Puntos: ${this.puntos}`
      );
      this.supabaseService.gameLog(this.puntos, 'Mayor o menor');

      if (reiniciar) {
        this.puntos = 0;
        this.vidas = 3;
        this.iniciarJuego();
      }
    }
  }

  ayuda() {
    this.messagesService.helpMessage('Mayor o menor es un juego en el que deberás adivinar si la carta que está volteada es mayor o menor a tu carta visible. Si aciertas, sumás puntos; si no, restás.');
  }
}
