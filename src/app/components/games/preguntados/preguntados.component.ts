import { Component } from '@angular/core';
import { PreguntadosService } from '../../../services/preguntados.service';
import { MessagesService } from '../../../services/messages.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent {
  question: any;
  selected: string | null = null;
  isCorrect: boolean | null = null;
  puntos: number = 0;
  flag: string = '';
  disabled: boolean = false;
  private inicioJuego: number = 0;

  constructor(private preguntadosService: PreguntadosService, private messagesService: MessagesService, private supabaseService: SupabaseService) { }

  ngOnInit() {
    this.newQuestion();
  }

  async newQuestion() {
    this.inicioJuego = Date.now();
    this.question = this.preguntadosService.getRandomQuestion();
    if (this.question) this.flag = this.question;
    this.selected = null;
    this.isCorrect = null;

    if (!this.question) {
      const isConfirmed = await this.messagesService.endGame('🏁 ¡Se terminaron las banderas!', `Nos quedamos sin banderas en sistema, tu puntuación final fue: ${this.puntos}`);
      this.question = this.flag;
      this.disabled = true;
      this.supabaseService.gameLog(this.puntos, 'Preguntados');

      if (isConfirmed) {
        this.preguntadosService.resetGame();
        this.puntos = 0;
        this.newQuestion();
      }
    }
  }

  selectOption(option: string) {
    this.selected = option;
    this.isCorrect = option === this.question.correct;

    if (this.isCorrect) {
      const tiempoSegundos = Math.floor((Date.now() - this.inicioJuego) / 1000);
      const bonusRapidez = Math.max(0, 20 - tiempoSegundos);
      this.puntos += bonusRapidez;
      this.messagesService.succesMessage('🎉 Acertaste!', `Acertaste el país, sumas 1 punto + Bonus por rapidez ${bonusRapidez}`);
      this.puntos++;
    } else {
      this.messagesService.wrongAnswer(`La respuesta correcta era ${this.question.correct}, restas 1 punto`);
      if (this.puntos > 0) { this.puntos--; }
    }
    setTimeout(() => {
      this.newQuestion();
    }, 2000);
  }

  ayuda() {
    this.messagesService.helpMessage('Preguntados es un juego en el que deberás adivinar de qué país es la bandera que aparece en la imagen. Tienes 4 opciones, de las cuales solo 1 es la correcta. Si aciertas, sumas puntos; si no, restas.');
  }
}
