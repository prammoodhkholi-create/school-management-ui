import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DEFAULT_TENANT_SLUG } from '../constants/app.constants';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    const slug = route.params['tenantSlug'] ?? route.parent?.params['tenantSlug'] ?? DEFAULT_TENANT_SLUG;
    return router.createUrlTree([`/${slug}/login`]);
  }
  return true;
};
