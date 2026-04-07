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
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
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
    { label: 'SIDEBAR.USERS', icon: 'pi-key', route: 'users', roles: ['ADMIN'] },
    { label: 'SIDEBAR.PARENTS', icon: 'pi-users', route: 'parents', roles: ['ADMIN'] },
    { label: 'SIDEBAR.ATTENDANCE', icon: 'pi-check-square', route: 'attendance', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.TIMETABLE', icon: 'pi-calendar', route: 'timetable', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.EVENTS', icon: 'pi-flag', route: 'events', roles: ['ADMIN', 'TEACHER'] },
    { label: 'SIDEBAR.EXAMS', icon: 'pi-file-edit', route: 'exams', roles: ['ADMIN', 'TEACHER'] },
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
