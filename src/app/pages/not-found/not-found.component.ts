import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TenantService } from '../../core/services/tenant.service';
import { DEFAULT_TENANT_SLUG } from '../../core/constants/app.constants';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule],
  template: `
    <div class="error-wrapper">
      <p-card styleClass="error-card">
        <div class="error-content">
          <i class="pi pi-question-circle error-icon"></i>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <a [routerLink]="'/' + tenantSlug + '/login'" class="back-link">Go Home</a>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .error-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--surface-ground); }
    .error-content { text-align: center; padding: 2rem; }
    .error-icon { font-size: 4rem; color: #6c757d; margin-bottom: 1rem; }
    h1 { margin-bottom: 1rem; }
    .back-link { color: var(--primary-color); text-decoration: none; display: block; margin-top: 1rem; }
  `]
})
export class NotFoundComponent {
  private tenantService = inject(TenantService);
  get tenantSlug(): string { return this.tenantService.getTenantSlug() || DEFAULT_TENANT_SLUG; }
}
