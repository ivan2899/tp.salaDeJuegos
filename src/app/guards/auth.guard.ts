import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { inject } from '@angular/core';
import { MessagesService } from '../services/messages.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const messages = inject(MessagesService);

  const { data } = await supabase.client.auth.getUser();

  if (data.user) {
    return true;
  } else {
    messages.anonymous();
    return false;
  }
};