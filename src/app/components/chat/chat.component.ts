import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Message } from '../../models/message';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey);

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
  actualUser: string = 'navebo4226@aperiol.com';
  private channel!: RealtimeChannel;

  constructor() {}

  async ngOnInit() {
    await this.loadMessages();

    this.channel = supabase
      .channel('chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload) => {
          const newMsg = payload.new as any;

          this.messages.push({
            text: newMsg.texto,
            type: newMsg.email === this.actualUser ? 'sent' : 'received',
            email: newMsg.email,
            created_at: newMsg.created_at
          });

          this.scrollToBottom();
        }
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
    }
  }

  private async loadMessages() {
    const { data, error } = await supabase
      .from<any, any>('chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al cargar mensajes:', error.message);
      return;
    }

    this.messages = (data || []).map((msg: any) => ({
      text: msg.texto,
      type: msg.email === this.actualUser ? 'sent' : 'received',
      email: msg.email,
      created_at: msg.created_at
    }));

    this.scrollToBottom();
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    const messageToSend = this.newMessage.trim();
    const now = new Date().toISOString();

    // Mostrar mensaje inmediatamente
    this.messages.push({
      text: messageToSend,
      type: 'sent',
      email: this.actualUser,
      created_at: now
    });

    this.scrollToBottom();

    // Guardar en Supabase
    const { error } = await supabase
      .from<any, any>('chat')
      .insert([{ email: this.actualUser, texto: messageToSend }]);

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
