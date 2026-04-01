import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TenantService } from '../services/tenant.service';
import { map, catchError, of } from 'rxjs';

export const tenantGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tenantService = inject(TenantService);
  const router = inject(Router);
  const slug = route.params['tenantSlug'] ?? route.parent?.params['tenantSlug'];

  if (!slug) {
    return router.createUrlTree(['/tenant-not-found']);
  }

  return tenantService.loadTenant(slug).pipe(
    map(tenant => {
      if (!tenant) {
        return router.createUrlTree(['/tenant-not-found']);
      }
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/tenant-not-found'])))
  );
};
