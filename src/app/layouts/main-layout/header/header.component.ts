import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, TranslateModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <p-button icon="pi pi-bars" [text]="true" (onClick)="toggleSidebar.emit()" class="mobile-only"></p-button>
      </div>
      <div class="header-right">
        <div class="lang-switcher">
          <button class="lang-btn" [class.active]="currentLang === 'en'" (click)="setLang('en')">EN</button>
          <span>|</span>
          <button class="lang-btn" [class.active]="currentLang === 'ta'" (click)="setLang('ta')">தமிழ்</button>
        </div>
        <div class="user-menu">
          <div class="user-avatar" (click)="menu.toggle($event)">
            <span class="avatar-initials">{{ userInitials }}</span>
            <span class="user-name">{{ userName }}</span>
            <i class="pi pi-chevron-down"></i>
          </div>
          <p-menu #menu [model]="userMenuItems" [popup]="true"></p-menu>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: var(--header-height);
      background: white;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-right { display: flex; align-items: center; gap: 1.5rem; }
    .lang-switcher { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
    .lang-btn { background: none; border: none; cursor: pointer; color: var(--text-color-secondary); padding: 0.25rem; }
    .lang-btn.active { color: var(--primary-color); font-weight: 600; }
    .user-menu { position: relative; }
    .user-avatar { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .avatar-initials { width: 36px; height: 36px; border-radius: 50%; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.85rem; }
    .user-name { font-weight: 500; }
    .mobile-only { display: none; }
    @media (max-width: 768px) { .mobile-only { display: flex; } }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private i18nService = inject(I18nService);
  private tenantService = inject(TenantService);
  private router = inject(Router);

  get currentLang(): string { return this.i18nService.getCurrentLang(); }
  get userName(): string { return this.authService.getCurrentUser()?.name ?? ''; }
  get userInitials(): string {
    const name = this.userName;
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  userMenuItems: MenuItem[] = [
    { label: 'Change Password', icon: 'pi pi-key', command: () => this.goToChangePassword() },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.authService.logout() }
  ];

  setLang(lang: 'en' | 'ta'): void { this.i18nService.setLanguage(lang); }

  private goToChangePassword(): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/change-password`]);
  }
}
