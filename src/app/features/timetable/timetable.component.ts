import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `<p-card><h2>Timetable</h2><p>Coming soon</p></p-card>`
})
export class TimetableComponent {}
