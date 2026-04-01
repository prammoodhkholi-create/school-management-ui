import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const firstLoginGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();
  const slug = route.params['tenantSlug'] ?? route.parent?.params['tenantSlug'] ?? 'greenvalley';

  if (user?.isFirstLogin && !route.url.some(s => s.path === 'change-password')) {
    return router.createUrlTree([`/${slug}/change-password`]);
  }
  return true;
};
