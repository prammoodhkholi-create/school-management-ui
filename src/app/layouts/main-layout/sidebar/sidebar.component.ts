import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
import { handleImageError, DEFAULT_LOGO_SVG } from '../../../shared/utils/image.utils';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed" [class.open]="mobileOpen">
      <div class="sidebar-header">
        <img [src]="tenantLogo" [alt]="tenantName" class="school-logo" (error)="onImgError($event)">
        <span class="school-name" *ngIf="!collapsed">{{ tenantName }}</span>
      </div>
      <nav class="sidebar-nav">
        <a *ngFor="let item of filteredNavItems"
           [routerLink]="'/' + tenantSlug + '/' + item.route"
           routerLinkActive="active-nav-item"
           class="nav-item"
           (click)="closeMobile()">
          <i [class]="'pi ' + item.icon"></i>
          <span *ngIf="!collapsed">{{ item.label | translate }}</span>
        </a>
      </nav>
      <div class="sidebar-toggle desktop-only" (click)="toggleCollapse()">
        <i [class]="collapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"></i>
      </div>
    </aside>
    <div class="sidebar-overlay" *ngIf="mobileOpen" (click)="closeMobile()"></div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: var(--sidebar-width);
      background: white;
      border-right: 1px solid #e9ecef;
      display: flex;
      flex-direction: column;
      transition: width 0.3s;
      z-index: 200;
    }
    .sidebar.collapsed { width: var(--sidebar-collapsed-width); }
    .sidebar-header {
      padding: 1.25rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid #e9ecef;
      overflow: hidden;
    }
    .school-logo { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; }
    .school-name { font-weight: 700; font-size: 0.9rem; color: var(--primary-color); white-space: nowrap; overflow: hidden; }
    .sidebar-nav { flex: 1; padding: 0.75rem 0; overflow-y: auto; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: var(--text-color);
      text-decoration: none;
      border-radius: 0 24px 24px 0;
      margin: 0.125rem 0.5rem 0.125rem 0;
      transition: background 0.2s;
    }
    .nav-item:hover { background: #f0f4f0; }
    .nav-item.active-nav-item { background: var(--primary-color); color: white; }
    .sidebar-toggle {
      padding: 1rem;
      border-top: 1px solid #e9ecef;
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
    .sidebar-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 199;
    }
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); transition: transform 0.3s; }
      .sidebar.open { transform: translateX(0); }
      .desktop-only { display: none; }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileOpenChange = new EventEmitter<boolean>();

  private authService = inject(AuthService);
  private tenantService = inject(TenantService);

  get tenantSlug(): string { return this.tenantService.getTenantSlug(); }
  get tenantName(): string { return this.tenantService.currentTenant()?.schoolName ?? ''; }
  get tenantLogo(): string { return this.tenantService.currentTenant()?.logo ?? ''; }

  navItems: NavItem[] = [
    { label: 'SIDEBAR.DASHBOARD', icon: 'pi-home', route: 'dashboard', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.STUDENTS', icon: 'pi-users', route: 'students', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.STAFF', icon: 'pi-id-card', route: 'staff', roles: ['ADMIN'] },
    { label: 'SIDEBAR.ATTENDANCE', icon: 'pi-check-square', route: 'attendance', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.TIMETABLE', icon: 'pi-calendar', route: 'timetable', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.EVENTS', icon: 'pi-flag', route: 'events', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.SETUP', icon: 'pi-cog', route: 'setup', roles: ['ADMIN'] },
  ];

  get filteredNavItems(): NavItem[] {
    const role = this.authService.getRole() ?? '';
    return this.navItems.filter(item => item.roles.includes(role));
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  closeMobile(): void {
    this.mobileOpen = false;
    this.mobileOpenChange.emit(false);
  }

  onImgError(event: Event): void { handleImageError(event, DEFAULT_LOGO_SVG); }
}
