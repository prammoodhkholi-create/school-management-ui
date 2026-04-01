import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `<p-card><h2>Dashboard</h2><p>Coming soon</p></p-card>`
})
export class DashboardComponent {}
