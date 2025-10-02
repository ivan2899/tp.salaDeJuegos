import { Injectable } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private channel: RealtimeChannel | null = null;

  //Traigo mi instancia de supabase
  constructor( private supabaseService: SupabaseService) { 
  }


   //Message[] dto, la lista de mensajes
   // {data, error} es una forma de deconstruir un obj en js. 
   //hago la query postrgres. 
   //if error true retorno vacio.
   //data son los message[]
  async fetchMessages(): Promise<Message[]>{
    const{ data, error } = await this.supabaseService.client
    .from('chat')
    .select('*')
    .order('created_at', { ascending: true});

    if(error){
      console.error('Error fetching messages:', error.message);
      return [];
    }

    return data as Message[]; //forzamos el tipo de dato xq sabemos lo que retorna. type assertion
  }


  //insertamos el msj en la db
  async sendMessage(text: string, userEmail: string): Promise<boolean>{
    const { error } = await this.supabaseService.client.from('chat').insert([
      {
        text: text.trim(),
        email: userEmail,
      },
    ]);

    if(error){
      console.error('Error sending message;', error.message);
      return false;
    }

    return true;
  }




  //RealTimeChannel channel es un canal con la DB.
  //.on esta escuchando el evento INSERT en public.messages
  //payload es el mensaje nuevo
  //retorno el channel para que el componente maneje la instancia y termine la subscipcion.
  //Esto es lo importante, recibe una callback function(onNewMessage), cada vez que se inserta un msj en la db se ejecuta.
  //la callback que mando desde el componente, pushea el mensaje a un array de msjs que se muestran en el html.
  subscribeToMessages(onNewMessage: (msg: Message) => void): RealtimeChannel{
    this.channel = this.supabaseService.client.channel('chat-channel')
    .on('postgres_changes',{
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, (payload) =>{
      const newMessage = payload.new as Message;
      onNewMessage(newMessage);
    }).subscribe((status) =>{
      console.log('Realtime subscription status:', status);
    });

    return this.channel;
  }




  //Esto creo que corresponde en chatComponent(no aca en el servicio, salvo que mande la instancia). Es para liberar la memoria.
  removeSubscription(): void{
    if(this.channel){
      this.supabaseService.client.removeChannel(this.channel);
      this.channel = null;
    }
  }




}
