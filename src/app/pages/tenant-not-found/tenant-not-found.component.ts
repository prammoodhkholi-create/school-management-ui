import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-tenant-not-found',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <div class="error-wrapper">
      <p-card styleClass="error-card">
        <div class="error-content">
          <i class="pi pi-exclamation-triangle error-icon"></i>
          <h1>School Not Found</h1>
          <p>The school you're looking for doesn't exist. Please check the URL and try again.</p>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .error-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--surface-ground); }
    .error-content { text-align: center; padding: 2rem; }
    .error-icon { font-size: 4rem; color: #f59e0b; margin-bottom: 1rem; }
    h1 { margin-bottom: 1rem; }
  `]
})
export class TenantNotFoundComponent {}
