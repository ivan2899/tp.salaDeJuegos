import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  username!: string;
  mostrarChat = false;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      const { username } = nav.extras.state;
      this.username = username;
      console.log(this.username);
    }
  }

  verificar(ruta: string) {
    if ((this.username == undefined || this.username == '' || !this.username)) {
      Swal.fire({
        title: "No iniciaste sesión",
        text: "No puedes ingresar porque no iniciaste sesión, puedes redirigirte a la pag de inicio para ingresar",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, redirigir"
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('login');
        }
      });
    }
    else {
      switch (ruta) {
        case "chat":
           this.mostrarChat = !this.mostrarChat;
          break;
        case "ahorcado":
          this.router.navigateByUrl('juegos/ahorcado');
          break;
        case "mayormenor":
          this.router.navigateByUrl('mayormenor');
          break;
        case "preguntados":
          this.router.navigateByUrl('preguntados');
          break;
        case "blackjack":
          this.router.navigateByUrl('blackjack');
          break;
      }
    }
  }
}
