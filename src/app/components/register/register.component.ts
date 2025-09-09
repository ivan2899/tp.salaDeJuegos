import { Component } from '@angular/core';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import Swal from 'sweetalert2';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string;
  password: string;
  passwordConfirm: string = '';
  name: string = '';

  constructor(private router: Router) {
    this.username = '';
    this.password = '';
  }

  register() {
    if ((!this.name || !this.username || !this.password || !this.passwordConfirm) || (this.name == undefined || this.username == undefined || this.password == undefined || this.passwordConfirm == undefined)) {
      this.error("Hay campos invalidos o vacíos. Verifique su Correo y Clave");
    } else if (this.username == '' || this.password == '' || this.name == '' || this.passwordConfirm == '') {
      this.error("Hay campos incompletos. Verifique su Correo y Clave");
    } else {

      if (RegisterComponent.validarClave(this.password, this.passwordConfirm)) {

        supabase.auth.signUp({
          email: this.username,
          password: this.password,
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error:', error.message);
            this.error(this.traducirError(error.message));
          } else {
            console.log('User registered:', data.user);
            this.saveUserData(data.user!);
          }
        }
        );
      }
      else {
        this.error("Las claves no coinciden");
      }
    }
  }

  private error(mensaje: string) {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

    private traducirError(codigo: string): string {
    switch (codigo) {
      case 'Invalid login credentials':
        return 'Credenciales inválidas. Verifique su Correo y Clave.';
      case 'Email not confirmed':
        return 'Debe confirmar su correo antes de iniciar sesión.';
      case 'User not found':
        return 'El usuario no existe en el sistema.';
      case 'Password should be at least 6 characters.':
        return 'La contraseña debe tener al menos 6 caracteres.';
      default:
        return 'Ocurrió un error inesperado. Intente nuevamente.';
    }
  }

  private static validarClave(a: string, b: string): boolean {
    return a == b;
  }

  saveUserData(user: User) {

    supabase.from('datos-usuarios')
      .select('*')
      .eq('email', this.username)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al verificar usuario:', error.message);
          this.error("Hubo un problema al verificar el usuario");
          return;
        }

        if (data && data.length > 0) {
          this.error("El usuario ya está registrado");
        } else {
          supabase.from('datos-usuarios')
            .insert([
              { authId: user.id, name: this.name, email: this.username }
            ])
            .then(({ data, error }) => {
              if (error) {
                console.error('Error al registrar:', error.message);
                alert(error.message);
                this.error("El usuario ya está registrado");

              } else {
                this.router.navigate(['/home']);
              }
            });
        }
      });

  }
}
