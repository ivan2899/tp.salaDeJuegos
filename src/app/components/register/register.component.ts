import { Component } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
   username: string = '';
  password: string = '';
  passwordConfirm: string = '';
  name: string = '';

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private messagesServices: MessagesService
  ) {}

  async register() {
    if (!this.name || !this.username || !this.password || !this.passwordConfirm) {
      this.error("Hay campos inválidos o vacíos. Verifique su Correo y Clave");
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.error("Las claves no coinciden");
      return;
    }

    const { data, error } = await this.supabaseService.signUp(this.username, this.password);

    if (error) {
      this.error(this.traducirError(error.message));
      return;
    }

    if (data.user) {
      await this.saveUserData(data.user);
    }
  }

  private async saveUserData(user: User) {
    const { data: existe, error: errorCheck } = await this.supabaseService.userExists(this.username);

    if (errorCheck) {
      this.error("Hubo un problema al verificar el usuario");
      return;
    }

    if (existe && existe.length > 0) {
      this.error("El usuario ya está registrado");
      return;
    }

    const { error } = await this.supabaseService.saveUserData(user, this.name, this.username);

    if (error) {
      this.error("Hubo un problema al registrar el usuario");
    } else {
      this.messagesServices.succesMessage("Usuario registrado", "Su usuario fue creado con éxito, recuerde verificar el correo")
      this.router.navigate(['/home']);
    }
  }

  private error(mensaje: string) {
    this.messagesServices.errorMessage('Error', mensaje);
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
      case 'User already registered':
        return 'El email ya se encuentra registrado.';
      case 'Unable to validate email address: invalid format':
        return 'El email no tiene un formato correcto';
      default:
        return 'Ocurrió un error inesperado. Intente nuevamente.';
    }
  }
}