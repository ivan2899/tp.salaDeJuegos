import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, LoginComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
isLoggedIn = false;
  email = '';
  name = '';

  private authSub: any;

  constructor(private router: Router) { }

  async ngOnInit() {
    // Obtener usuario si ya está logueado
    const { data } = await supabase.auth.getUser();
    const metadata = data.user?.user_metadata;

    if (data.user) {
      this.isLoggedIn = true;
      this.name = data.user.user_metadata?.['name'] || data.user.email;
    }

    // Escuchar cambios de login/logout
    this.authSub = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this.isLoggedIn = true;
        this.name = session.user.user_metadata?.['name'] || session.user.email;
      } else {
        this.isLoggedIn = false;
        this.name = '';
      }
    });
  }

  private async logoutInt() {
    await supabase.auth.signOut();
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }


  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Volverás al inicio y deberás loguear',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logoutInt();
      }
    });
  }


  ngOnDestroy() {
    if (this.authSub?.unsubscribe) {
      this.authSub.unsubscribe();
    }
  }
}
