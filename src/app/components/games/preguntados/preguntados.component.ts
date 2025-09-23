import { Component } from '@angular/core';
import { PreguntadosService } from '../../../services/preguntados.service';
import Swal from 'sweetalert2';

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


  constructor(private preguntadosService: PreguntadosService) { }

  ngOnInit() {
    this.newQuestion();
  }


  newQuestion() {
    this.question = this.preguntadosService.getRandomQuestion();
    this.selected = null;
    this.isCorrect = null;

    if (!this.question) {
      // 👉 Se acabaron las banderas
      Swal.fire(
        '🏁 ¡Se terminaron las banderas!',
        `Nos quedamos sin banderas en el sistema, tu puntuación final fue: ${this.puntos}`,
        'info'
      ).then(() => {
        // Si querés reiniciar el juego automáticamente:
        this.preguntadosService.resetGame();
        this.puntos = 0;
        this.newQuestion();
      });
    }
  }

  selectOption(option: string) {
    this.selected = option;
    this.isCorrect = option === this.question.correct;

    if (this.isCorrect) {
      Swal.fire('🎉 Acertaste!', 'Acertaste el país, sumas 1 punto', 'success');
      this.puntos++;
    } else {
      Swal.fire('❌ Incorrecto', `La respuesta correcta era ${this.question.correct}, restas 1 punto`, 'error');
      if (this.puntos > 0) { this.puntos--; }
    }
    setTimeout(() => {
      this.newQuestion();
    }, 2000);
  }

  ayuda() {
    Swal.fire({
      title: "Cómo funciona?",
      text: "Preguntados es un juego en el que deberás adivinar de qué país es la bandera que aparece en la imagen. Tienes 4 opciones, de las cuales solo 1 es la correcta. Si aciertas, sumas puntos; si no, restas.",
      icon: "question",
      background: "#ffa"
    });
  }
}
