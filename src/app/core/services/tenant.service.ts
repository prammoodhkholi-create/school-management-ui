import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Tenant } from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private http = inject(HttpClient);
  currentTenant = signal<Tenant | null>(null);

  loadTenant(slug: string): Observable<Tenant | null> {
    return this.http.get<Tenant[]>('/assets/mock/tenants.json').pipe(
      map(tenants => tenants.find(t => t.slug === slug) ?? null),
      tap(tenant => {
        if (tenant) {
          this.currentTenant.set(tenant);
          this.applyTheme(tenant);
        }
      })
    );
  }

  private applyTheme(tenant: Tenant): void {
    document.documentElement.style.setProperty('--primary-color', tenant.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', tenant.secondaryColor);
    document.documentElement.style.setProperty('--font-family', tenant.fontFamily);
  }

  getTenantId(): string {
    return this.currentTenant()?.id ?? '';
  }

  getTenantSlug(): string {
    return this.currentTenant()?.slug ?? '';
  }
}
