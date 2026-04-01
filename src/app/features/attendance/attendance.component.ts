import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `<p-card><h2>Attendance</h2><p>Coming soon</p></p-card>`
})
export class AttendanceComponent {}
