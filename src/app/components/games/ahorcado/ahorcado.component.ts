import { Component } from '@angular/core';
import palabrasData from '../../../../assets/media/palabras.json';
import { MessagesService } from '../../../services/messages.service';
import { max } from 'rxjs';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  puntos: number = 0;
  palabraOculta: string = '';
  letrasAdivinadas: string[] = [];
  intentos: number = 0;
  maxIntentos: number = 5;
  vidas: number = this.maxIntentos;
  teclado: string[][] = [];
  private palabras: string[] = palabrasData.palabras;

  private inicioJuego: number = 0;

  constructor(private messagesService: MessagesService, private supabaseService: SupabaseService) { }

  ngOnInit() {
    this.teclado = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    this.reiniciarJuego();
  }

  cargarPalabra() {
    const randomIndex = Math.floor(Math.random() * this.palabras.length);
    this.palabraOculta = this.palabras[randomIndex].toUpperCase();
    console.log(this.palabraOculta);
  }

  reiniciarJuego() {
    this.letrasAdivinadas = [];
    this.intentos = 0;
    this.puntos = 0;
    this.vidas = this.maxIntentos;
    this.cargarPalabra();
    this.inicioJuego = Date.now();
  }

  async presionarLetra(letra: string) {
    if (this.letrasAdivinadas.includes(letra)) return;

    this.letrasAdivinadas.push(letra);

    if (this.palabraOculta.includes(letra)) {
      this.puntos += 5;
    } else {
      this.intentos++;
      this.vidas--;
      this.messagesService.wrongAnswer(`😢La letra no está en esta palabra, te quedan ${this.vidas} vidas`);
      this.puntos = Math.max(0, this.puntos - 1);
    }

    if (this.gano) {
      const tiempoSegundos = Math.floor((Date.now() - this.inicioJuego) / 1000);
      const bonusRapidez = Math.max(0, 50 - tiempoSegundos);
      this.puntos += bonusRapidez;

      const reiniciar = await this.messagesService.winGame('Ganaste!!', `🎉 ¡Ganaste!. Errores: ${this.intentos}. Bonus por rapidez: ${bonusRapidez} puntos`);
      this.supabaseService.gameLog(this.puntos, 'Ahorcado');
      if (reiniciar) this.reiniciarJuego();

    } else if (this.perdio) {
      const reiniciar = await this.messagesService.endGame('Perdiste !!', `😢 Perdiste. La palabra era: ${this.palabraOculta}`)
      this.supabaseService.gameLog(this.puntos, 'Ahorcado');
      if (reiniciar) this.reiniciarJuego();
    }
  }

  get palabraMostrada(): string {
    return this.palabraOculta
      .split('')
      .map(letra => this.letrasAdivinadas.includes(letra) ? letra : '_')
      .join(' ');
  }

  get imagenAhorcado(): string {
    switch (this.intentos) {
      case 0:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/public/images/games/ahorcado/ahorcado0.png';
      case 1:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/public/images/games/ahorcado/ahorcado1.png';
      case 2:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/public/images/games/ahorcado/ahorcado2.png';
      case 3:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/public/images/games/ahorcado/ahorcado3.png';
      case 4:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/public/images/games/ahorcado/ahorcado4.png';
      case 5:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/public/images/games/ahorcado/ahorcado5.png';
      default:
        return 'No se encontró la imagen';
    }
  }

  get gano(): boolean {
    return !this.palabraMostrada.includes('_');
  }

  get perdio(): boolean {
    return this.intentos >= this.maxIntentos;
  }

  ayuda() {
    this.messagesService.helpMessage('El ahorcado es un juego en el que aparece una palabra oculta y tienes oportunidades limitadas para poder adivinarla (en este caso 5 vidas). Cada letra correcta suma 5 puntos, cada letra incorrecta resta 1, y hay bonus por rapidez.');
  }
}