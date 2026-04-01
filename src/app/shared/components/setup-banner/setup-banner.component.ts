import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setup-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="setup-banner">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    .setup-banner {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: var(--border-radius);
      padding: 1rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #856404;
    }
  `]
})
export class SetupBannerComponent {
  @Input() message = 'Setup is required before using this module.';
}
