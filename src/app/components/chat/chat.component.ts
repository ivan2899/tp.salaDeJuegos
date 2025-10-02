import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Message } from '../../models/message';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('chatBody') private chatBody!: ElementRef<HTMLDivElement>;

  newMessage: string = '';
  messages: Message[] = [];
  actualUser: string = '';
  private channel!: RealtimeChannel;

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    const { data: { user }, error } = await this.supabaseService.getCurrentUser();
    if (error) {
      console.error('Error al obtener usuario:', error.message);
      return;
    }

    if (user) {
      this.actualUser = user.email ?? '';
    }

    const { data, error: msgError } = await this.supabaseService.getMessages();
    if (!msgError && data) {
      this.messages = data.map((msg: any) => ({
        text: msg.text,
        type: msg.email === this.actualUser ? 'sent' : 'received',
        email: msg.email,
        created_at: msg.created_at
      }));
      this.scrollToBottom();
    }

    this.channel = this.supabaseService.subscribeToMessages((msg) => {
      msg.type = msg.email === this.actualUser ? 'sent' : 'received';
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }

  ngOnDestroy() {
    if (this.channel) {
      this.supabaseService.removeChannel(this.channel);
    }
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    const messageToSend = this.newMessage.trim();
    const now = new Date().toISOString();

    this.messages.push({
      text: messageToSend,
      type: 'sent',
      email: this.actualUser,
      created_at: now
    });
    this.scrollToBottom();

    const { error } = await this.supabaseService.sendMessage(this.actualUser, messageToSend);
    if (error) {
      console.error('Error al registrar el mensaje:', error.message);
      alert(error.message);
    }

    this.newMessage = '';
  }

  private scrollToBottom(delay = 50) {
    setTimeout(() => {
      const el = this.chatBody?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, delay);
  }
}