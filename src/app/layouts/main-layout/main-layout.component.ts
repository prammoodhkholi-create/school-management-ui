import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, SidebarComponent, HeaderComponent],
  template: `
    <p-toast></p-toast>
    <div class="layout-wrapper">
      <app-sidebar
        [(collapsed)]="sidebarCollapsed"
        [(mobileOpen)]="sidebarMobileOpen">
      </app-sidebar>
      <div class="layout-main" [class.sidebar-collapsed]="sidebarCollapsed">
        <app-header (toggleSidebar)="sidebarMobileOpen = !sidebarMobileOpen"></app-header>
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  sidebarCollapsed = false;
  sidebarMobileOpen = false;
}
