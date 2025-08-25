import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  name!: string;
  password!: string;

  UsuarioUno() {
    this.name = "aa";
    this.password = "5ad858";
  }

  UsuarioDos() {
    this.name = "212";
    this.password = "A**S";
  }
}
