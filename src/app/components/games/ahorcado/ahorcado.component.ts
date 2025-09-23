import { Component, NgModule } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  puntos: number = 50;
  palabraOculta: string = '';
  letrasAdivinadas: string[] = [];
  intentos: number = 0;
  maxIntentos: number = 5;
  teclado: string[][] = [];
  private palabras: string[] = [
    "auto", "coche", "avion", "tren", "barco", "bicicleta", "camion", "moto", "patineta", "submarino",
    "computadora", "teclado", "pantalla", "raton", "impresora", "telefono", "celular", "televisor", "cable", "internet",
    "perro", "gato", "caballo", "vaca", "oveja", "conejo", "leon", "tigre", "elefante", "jirafa",
    "mesa", "silla", "puerta", "ventana", "piso", "techo", "pared", "cuadro", "cama", "armario",
    "rojo", "azul", "verde", "amarillo", "negro", "blanco", "gris", "marron", "violeta", "rosa",
    "agua", "fuego", "tierra", "aire", "nieve", "lluvia", "viento", "nube", "rayo", "trueno",
    "pan", "leche", "carne", "pescado", "pollo", "arroz", "pasta", "queso", "huevo", "fruta",
    "escuela", "colegio", "universidad", "profesor", "alumno", "examen", "libro", "cuaderno", "lapiz", "boligrafo",
    "futbol", "tenis", "baloncesto", "natacion", "ciclismo", "voleibol", "gimnasia", "boxeo", "golf", 
    "ciudad", "pueblo", "pais", "mundo", "continente", "rio", "mar", "oceano", "bosque", "estacionamiento"
  ];

  constructor() { }

  ngOnInit() {
    this.cargarPalabra();

    this.teclado = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    this.reiniciarJuego();
  }

  // Carga una palabra aleatoria desde el arreglo interno
  cargarPalabra() {
    const randomIndex = Math.floor(Math.random() * this.palabras.length);
    this.palabraOculta = this.palabras[randomIndex].toUpperCase();
  }

  // Reinicia variables y carga nueva palabra
  reiniciarJuego() {
    this.letrasAdivinadas = [];
    this.intentos = 0;
    this.cargarPalabra();
  }

  // Verificar letra
  presionarLetra(letra: string) {
    console.log(this.palabraOculta);

    if (this.letrasAdivinadas.includes(letra)) return;

    this.letrasAdivinadas.push(letra);

    if (!this.palabraOculta.includes(letra)) {
      this.intentos++;
      if (this.puntos > 0 ) {this.puntos -= 10;}
    }

    if (this.gano) {
      Swal.fire({
        title: 'Ganaste!!',
        text: `🎉 ¡Ganaste!. Errores: ${this.intentos}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Reiniciar juego"
      }).then((result) => {
        if (result.isConfirmed) {
          this.reiniciarJuego();
        }
      });
    } else if (this.perdio) {
      Swal.fire({
        title: 'Perdiste !!',
        text: `😢 Perdiste. La palabra era: ${this.palabraOculta}`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Reiniciar juego"
      }).then((result) => {
        if (result.isConfirmed) {
          this.reiniciarJuego();
        }
      });
    }
  }

  // Mostrar guiones o letras
  get palabraMostrada(): string {
    return this.palabraOculta
      .split('')
      .map(letra => this.letrasAdivinadas.includes(letra) ? letra : '_')
      .join(' ');
  }

  // Imagen según intentos
  get imagenAhorcado(): string {
    switch (this.intentos) {
      case 0:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/sign/images/games/ahorcado/ahorcado0.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84YTFjNTE5YS05ZDIzLTQ3Y2UtODAyOC1iMmZlYWJkNDY0MmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZ2FtZXMvYWhvcmNhZG8vYWhvcmNhZG8wLnBuZyIsImlhdCI6MTc1NzQzNjQ0NiwiZXhwIjozMzM0MjM2NDQ2fQ.dqkW8MSVDXlszsk2pcxm1Ojgn-UJtASZeLYBczOOzJ8';
      case 1:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/sign/images/games/ahorcado/ahorcado1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84YTFjNTE5YS05ZDIzLTQ3Y2UtODAyOC1iMmZlYWJkNDY0MmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZ2FtZXMvYWhvcmNhZG8vYWhvcmNhZG8xLnBuZyIsImlhdCI6MTc1NzQzNjQ5NCwiZXhwIjoxNzg4OTcyNDk0fQ.NBUe5hptzhcZ7ok_ZcJbpBCXEDhZ7nnXWcBXgZ3TqqQ';
      case 2:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/sign/images/games/ahorcado/ahorcado2.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84YTFjNTE5YS05ZDIzLTQ3Y2UtODAyOC1iMmZlYWJkNDY0MmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZ2FtZXMvYWhvcmNhZG8vYWhvcmNhZG8yLnBuZyIsImlhdCI6MTc1NzQzNjUwNSwiZXhwIjoxNzg4OTcyNTA1fQ.urmUIFGh4zu51VrcHwLjM-XUXVLgpbXnyKWzwInhRI4';
      case 3:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/sign/images/games/ahorcado/ahorcado3.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84YTFjNTE5YS05ZDIzLTQ3Y2UtODAyOC1iMmZlYWJkNDY0MmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZ2FtZXMvYWhvcmNhZG8vYWhvcmNhZG8zLnBuZyIsImlhdCI6MTc1NzQzNjU0NywiZXhwIjoxNzg4OTcyNTQ3fQ.7SiIWliNsKvbPDRwSO5DTA841y0gs0DtCmElzgr0fm8';
      case 4:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/sign/images/games/ahorcado/ahorcado4.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84YTFjNTE5YS05ZDIzLTQ3Y2UtODAyOC1iMmZlYWJkNDY0MmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZ2FtZXMvYWhvcmNhZG8vYWhvcmNhZG80LnBuZyIsImlhdCI6MTc1NzQzNjU1NywiZXhwIjoxNzg4OTcyNTU3fQ.92iV4X9hHac9HlX99rK60sd3tpa434zBVLb2SpytgII';
      case 5:
        return 'https://wwgfysczkcuaqjmpqkxo.supabase.co/storage/v1/object/sign/images/games/ahorcado/ahorcado5.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84YTFjNTE5YS05ZDIzLTQ3Y2UtODAyOC1iMmZlYWJkNDY0MmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZ2FtZXMvYWhvcmNhZG8vYWhvcmNhZG81LnBuZyIsImlhdCI6MTc1NzQzNjU3MCwiZXhwIjoxNzg4OTcyNTcwfQ.bUQOUDDpGqvChfnLL9AoHq1TZ6r9BdgLnWuXgSoRh0k';
    }
    return `assets/ahorcado/ahorcado${this.intentos}.png`;
  }

  // Saber si ganó
  get gano(): boolean {
    return !this.palabraMostrada.includes('_');
  }

  // Saber si perdió
  get perdio(): boolean {
    return this.intentos >= this.maxIntentos;
  }

  ayuda() {
    Swal.fire({
      title: "Cómo funciona?",
      text: "El ahorcado es un juego en el que aparece una palabra oculta y tienes oportunidades limitadas para poder adivinarla (en este caso 5 vidas)",
      icon: "question",
      background: "#ffa"
    });
  }
}
