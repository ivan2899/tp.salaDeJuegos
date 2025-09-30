import { CanActivateFn } from '@angular/router';

export const surveyGuard: CanActivateFn = (route, state) => {
  return true;
};
