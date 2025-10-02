import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { JuegosModule } from '../../modulos/juegos/juegos.module';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { MessagesService } from '../../services/messages.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet, JuegosModule, ChatComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  username!: string;
  mostrarChat = false;

  constructor(private router: Router, private supabaseService: SupabaseService, private messagesService: MessagesService) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      const { username } = nav.extras.state;
      this.username = username;
      console.log(this.username);
    }
  }

  async verificar(ruta: string) {
    switch (ruta) {
      case "chat":
        const user = await this.supabaseService.getCurrentUser();
        if (user?.data.user) {
          this.mostrarChat = !this.mostrarChat;
        } else {
          this.messagesService.anonymous();
          this.mostrarChat = false;
        }
        break;
      case "ahorcado":
        this.router.navigateByUrl('juegos/ahorcado');
        break;
      case "mayormenor":
        this.router.navigateByUrl('juegos/mayormenor');
        break;
      case "preguntados":
        this.router.navigateByUrl('juegos/preguntados');
        break;
      case "blackjack":
        this.router.navigateByUrl('juegos/blackjack');
        break;
    }
  }

  redireccion(url: string) {
    this.router.navigate([url]);
  }
}
