import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username!: string;
  password!: string;

  constructor(
    public router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  onRadioChange(event: any) {
    const value = event.detail.value;
    console.log(value);

    switch (value) {
      case 'admin':
        this.username = 'admin@admin.com';
        this.password = '111111';
        break;
      case 'user':
        this.username = 'usuario@usuario.com';
        this.password = '333333';
        break;
      case 'guest':
        this.username = 'invitado@invitado.com';
        this.password = '222222';
        break;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'medium',
      position: 'bottom'
    });
    await toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
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
        this.showToast('Inicio de sesión exitoso ✅');
        huboError = false;
        this.router.navigateByUrl('alarma', {
          state: {
            username: this.username,
            password: this.password
          }
        });
      }
    }

    if(huboError){this.showAlert('Error', mensaje);}

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
}
