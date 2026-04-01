import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DEFAULT_TENANT_SLUG } from '../constants/app.constants';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles: string[] = route.data['requiredRole'] ?? [];

  if (requiredRoles.length === 0) return true;

  const role = authService.getRole();
  if (!role || !requiredRoles.includes(role)) {
    const slug = route.params['tenantSlug'] ?? route.parent?.params['tenantSlug'] ?? DEFAULT_TENANT_SLUG;
    return router.createUrlTree([`/${slug}/unauthorized`]);
  }
  return true;
};
