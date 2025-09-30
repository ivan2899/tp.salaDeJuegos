import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2'

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const { data } = await supabase.client.auth.getUser();

  if (data.user) {
    return true;
  } else {
    let timerInterval: any;
    let secondsLeft = 8;

    Swal.fire({
      title: 'No iniciaste sesión',
      html: `No puedes ingresar, serás redirigido al login en <b>${secondsLeft}</b> segundos.`,
      icon: 'error',
      timer: secondsLeft * 1000,
      timerProgressBar: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar redirección',
      confirmButtonText: 'Ir ahora',
      allowOutsideClick: false,
      didOpen: () => {
        const b = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (b) {
            secondsLeft--;
            b.textContent = secondsLeft.toString();
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer || result.isConfirmed) {
        router.navigateByUrl('/login');
      }
    });

    return false;
  }
};