import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { firstLoginGuard } from '../../core/guards/first-login.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const timetableRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard, firstLoginGuard],
    data: { requiredRole: ['ADMIN', 'TEACHER'] },
    loadComponent: () => import('./timetable-view/timetable-view.component').then(m => m.TimetableViewComponent)
  },
  {
    path: 'builder',
    canActivate: [authGuard, firstLoginGuard, roleGuard],
    data: { requiredRole: ['ADMIN'] },
    loadComponent: () => import('./timetable-builder/timetable-builder.component').then(m => m.TimetableBuilderComponent)
  }
];
