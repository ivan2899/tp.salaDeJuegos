import { Component, EventEmitter, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  constructor(private router: Router) {

  }

  logUser() {
    supabase.from('logs')
      .insert([
        { name: this.username }
      ])
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al registrar en log:', error.message);
          alert(error.message);
        }
      });
  }

  async login() {
    let valido = true;
    let huboError = true;
    let mensaje = '';

    if (this.username == '' || this.password == '') {
      mensaje = "Hay campos incompletos. Verifique su Correo y Clave";
      valido = false;
    } else if ((this.username == undefined || this.password == undefined) || (!this.username || !this.password)) {
      mensaje = "Hay campos invalidos o vacíos. Verifique su Correo y Clave";
      valido = false;
    }

    if (valido) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.username,
        password: this.password,
      });

      if (error) {
        mensaje = this.traducirError(error.message);
      } else {
        this.logUser();
        huboError = false;
        this.router.navigateByUrl('home', {
          state: {
            username: this.username,
          }
        });
      }
    }

    if (huboError) {

      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  private traducirError(codigo: string): string {
    switch (codigo) {
      case 'Invalid login credentials':
        return 'Credenciales inválidas. Verifique su Correo y Clave.';
      case 'Email not confirmed':
        return 'Debe confirmar su correo antes de iniciar sesión.';
      case 'User not found':
        return 'El usuario no existe en el sistema.';
      case 'Password should be at least 6 characters':
        return 'La contraseña debe tener al menos 6 caracteres.';
      default:
        return 'Ocurrió un error inesperado. Intente nuevamente.';
    }
  }

  UsuarioUno() {
    this.username = "navebo4226@aperiol.com";
    this.password = "@a--_:5858NaveBor";
  }

  UsuarioDos() {
    this.username = "palokoy768@aperiol.com";
    this.password = "+_+Pm@uF.rqi9$b";
  }
}
