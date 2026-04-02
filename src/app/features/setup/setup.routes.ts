import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { firstLoginGuard } from '../../core/guards/first-login.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const setupRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard, firstLoginGuard, roleGuard],
    data: { requiredRole: ['ADMIN'] },
    loadComponent: () => import('./setup.component').then(m => m.SetupComponent)
  },
  {
    path: 'academic-years',
    canActivate: [authGuard, firstLoginGuard, roleGuard],
    data: { requiredRole: ['ADMIN'] },
    loadComponent: () => import('./academic-year/academic-year.component').then(m => m.AcademicYearComponent)
  },
  {
    path: 'classes',
    canActivate: [authGuard, firstLoginGuard, roleGuard],
    data: { requiredRole: ['ADMIN'] },
    loadComponent: () => import('./class/class.component').then(m => m.ClassComponent)
  },
  {
    path: 'sections',
    canActivate: [authGuard, firstLoginGuard, roleGuard],
    data: { requiredRole: ['ADMIN'] },
    loadComponent: () => import('./section/section.component').then(m => m.SectionComponent)
  },
  {
    path: 'subjects',
    canActivate: [authGuard, firstLoginGuard, roleGuard],
    data: { requiredRole: ['ADMIN'] },
    loadComponent: () => import('./subject/subject.component').then(m => m.SubjectComponent)
  }
];
