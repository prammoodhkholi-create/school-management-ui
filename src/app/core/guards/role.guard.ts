import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles: string[] = route.data['requiredRole'] ?? [];

  if (requiredRoles.length === 0) return true;

  const role = authService.getRole();
  if (!role || !requiredRoles.includes(role)) {
    const slug = route.params['tenantSlug'] ?? route.parent?.params['tenantSlug'] ?? 'greenvalley';
    return router.createUrlTree([`/${slug}/unauthorized`]);
  }
  return true;
};
