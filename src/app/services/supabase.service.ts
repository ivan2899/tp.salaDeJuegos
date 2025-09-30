import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, RealtimeChannel, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.publicAnonKey);
  }


  // ------------------
  // 🔹 AUTH
  // ------------------

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  getUser() {
    return this.supabase.auth.getUser();
  }

  /** Devuelve la sesión actual */
  async getSession() {
    return await this.supabase.auth.getSession();
  }

  /** Suscripción a cambios de auth (login/logout) */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }

  get client() {
    return this.supabase;
  }

  // ------------------
  // 🔹 LOGS
  // ------------------
  async logUser(name: string) {
    return await this.supabase.from('logs').insert([{ name }]);
  }

  // ------------------
  // 🔹 USUARIOS
  // ------------------

  /** Verifica si un usuario ya existe en la tabla datos-usuarios */
  async userExists(email: string) {
    return await this.supabase
      .from('datos-usuarios')
      .select('*')
      .eq('email', email);
  }

  /** Inserta un nuevo usuario en datos-usuarios */
  async saveUserData(user: User, name: string, email: string) {
    return await this.supabase
      .from('datos-usuarios')
      .insert([{ authId: user.id, name, email }]);
  }


  // ------------------
  // 🔹 Chat
  // ------------------

  /** Obtiene todos los mensajes */
  async getMessages() {
    return await this.supabase
      .from('chat')
      .select('*')
      .order('created_at', { ascending: true });
  }

  /** Envía un nuevo mensaje */
  async sendMessage(email: string, texto: string) {
    return await this.supabase
      .from('chat')
      .insert([{ email, texto }]);
  }

  /** Suscripción a nuevos mensajes */
  subscribeToMessages(callback: (msg: Message) => void): RealtimeChannel {
    const channel = this.supabase
      .channel('chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat' },
        (payload) => {
          const newMsg = payload.new as any;
          const message: Message = {
            text: newMsg.texto,
            type: 'received', // el componente decide si es "sent" o "received"
            email: newMsg.email,
            created_at: newMsg.created_at
          };
          callback(message);
        }
      )
      .subscribe();

    return channel;
  }

  /** Cancelar suscripción */
  removeChannel(channel: RealtimeChannel) {
    this.supabase.removeChannel(channel);
  }
}