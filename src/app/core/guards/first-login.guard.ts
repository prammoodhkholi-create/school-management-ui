import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DEFAULT_TENANT_SLUG } from '../constants/app.constants';

export const firstLoginGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();
  const slug = route.params['tenantSlug'] ?? route.parent?.params['tenantSlug'] ?? DEFAULT_TENANT_SLUG;

  if (user?.isFirstLogin && !route.url.some(s => s.path === 'change-password')) {
    return router.createUrlTree([`/${slug}/change-password`]);
  }
  return true;
};
