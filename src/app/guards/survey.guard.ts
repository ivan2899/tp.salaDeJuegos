import { CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { inject } from '@angular/core';
import { MessagesService } from '../services/messages.service';

export const surveyGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const messages = inject(MessagesService);

  const role = await supabase.getRoleUser();

  if (role === 'Admin') {
    return true;
  } else {
    messages.wrongRole();
    return false;
  }
};