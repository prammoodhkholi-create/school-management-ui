import { Routes } from '@angular/router';
import { tenantGuard } from './core/guards/tenant.guard';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { firstLoginGuard } from './core/guards/first-login.guard';
import { DEFAULT_TENANT_SLUG } from './core/constants/app.constants';

export const routes: Routes = [
  { path: '', redirectTo: `/${DEFAULT_TENANT_SLUG}/login`, pathMatch: 'full' },
  {
    path: ':tenantSlug',
    canActivate: [tenantGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
          { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
          { path: 'change-password', canActivate: [authGuard], loadComponent: () => import('./features/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
          { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
        ]
      },
      {
        path: '',
        canActivate: [authGuard, firstLoginGuard],
        loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
          { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { requiredRole: ['ADMIN', 'TEACHER'] } },
          { path: 'students', loadComponent: () => import('./features/students/students.component').then(m => m.StudentsComponent), data: { requiredRole: ['ADMIN', 'TEACHER'] } },
          { path: 'staff', canActivate: [roleGuard], loadComponent: () => import('./features/staff/staff.component').then(m => m.StaffComponent), data: { requiredRole: ['ADMIN'] } },
          { path: 'attendance', loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent), data: { requiredRole: ['ADMIN', 'TEACHER'] } },
          { path: 'timetable', loadComponent: () => import('./features/timetable/timetable.component').then(m => m.TimetableComponent), data: { requiredRole: ['ADMIN', 'TEACHER'] } },
          { path: 'events', loadComponent: () => import('./features/events/events.component').then(m => m.EventsComponent), data: { requiredRole: ['ADMIN', 'TEACHER'] } },
          { path: 'setup', canActivate: [roleGuard], loadChildren: () => import('./features/setup/setup.routes').then(m => m.setupRoutes), data: { requiredRole: ['ADMIN'] } },
          { path: 'unauthorized', loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
        ]
      }
    ]
  },
  { path: 'tenant-not-found', loadComponent: () => import('./pages/tenant-not-found/tenant-not-found.component').then(m => m.TenantNotFoundComponent) },
  { path: 'not-found', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
