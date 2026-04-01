import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TenantService } from '../../core/services/tenant.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule],
  template: `
    <div class="error-wrapper">
      <p-card styleClass="error-card">
        <div class="error-content">
          <i class="pi pi-lock error-icon"></i>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <a [routerLink]="'/' + tenantSlug + '/dashboard'" class="back-link">Back to Dashboard</a>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .error-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--surface-ground); }
    .error-content { text-align: center; padding: 2rem; }
    .error-icon { font-size: 4rem; color: #e53935; margin-bottom: 1rem; }
    h1 { margin-bottom: 1rem; }
    .back-link { color: var(--primary-color); text-decoration: none; display: block; margin-top: 1rem; }
  `]
})
export class UnauthorizedComponent {
  private tenantService = inject(TenantService);
  get tenantSlug(): string { return this.tenantService.getTenantSlug() || 'greenvalley'; }
}
