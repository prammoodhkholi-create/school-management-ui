import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { StorageService } from '../../../core/services/storage.service';
import { TenantService } from '../../../core/services/tenant.service';
import { AuthService } from '../../../core/services/auth.service';
import { TimetableSlot } from '../../../core/models/timetable.model';
import { Class } from '../../../core/models/class.model';
import { Section } from '../../../core/models/section.model';
import { Subject } from '../../../core/models/subject.model';
import { Staff } from '../../../core/models/staff.model';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

interface GridCell {
  subjectName: string;
  staffName: string;
  slotId?: string;
}

@Component({
  selector: 'app-timetable-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonModule, CardModule, DropdownModule, TagModule],
  templateUrl: './timetable-view.component.html',
  styleUrl: './timetable-view.component.scss'
})
export class TimetableViewComponent implements OnInit {
  private storage = inject(StorageService);
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);
  private router = inject(Router);

  classes: Class[] = [];
  sections: Section[] = [];
  subjects: Subject[] = [];
  staff: Staff[] = [];

  classOptions: { label: string; value: string }[] = [];
  sectionOptions: { label: string; value: string }[] = [];

  selectedClassId: string | null = null;
  selectedSectionId: string | null = null;

  days = DAYS;
  periods = PERIODS;
  grid: Record<number, Record<string, GridCell>> = {};

  isAdmin = false;

  ngOnInit(): void {
    this.classes = this.storage.get<Class>('classes');
    this.sections = this.storage.get<Section>('sections');
    this.subjects = this.storage.get<Subject>('subjects');
    this.staff = this.storage.get<Staff>('staff');
    this.classOptions = this.classes.map(c => ({ label: c.name, value: c.id }));

    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === 'ADMIN';
  }

  onClassChange(classId: string): void {
    this.selectedClassId = classId;
    this.selectedSectionId = null;
    this.sectionOptions = this.sections.filter(s => s.classId === classId).map(s => ({ label: s.name, value: s.id }));
    this.grid = {};
  }

  onSectionChange(sectionId: string): void {
    this.selectedSectionId = sectionId;
    this.buildGrid();
  }

  buildGrid(): void {
    const slots = this.storage.get<TimetableSlot>('timetable').filter(
      s => s.classId === this.selectedClassId && s.sectionId === this.selectedSectionId
    );

    const newGrid: Record<number, Record<string, GridCell>> = {};
    for (const period of this.periods) {
      newGrid[period] = {};
      for (const day of this.days) {
        const slot = slots.find(s => s.period === period && s.day === day);
        newGrid[period][day] = slot ? {
          subjectName: this.subjects.find(sub => sub.id === slot.subjectId)?.name ?? '',
          staffName: this.staff.find(stf => stf.id === slot.staffId)?.name ?? '',
          slotId: slot.id
        } : { subjectName: '', staffName: '' };
      }
    }
    this.grid = newGrid;
  }

  goToBuilder(): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/timetable/builder`]);
  }

  getDayKey(day: string): string {
    return `TIMETABLE.${day.toUpperCase()}`;
  }
}
