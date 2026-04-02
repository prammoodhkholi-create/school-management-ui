import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { TenantService } from './tenant.service';
import { AcademicYear } from '../models/academic-year.model';
import { Class } from '../models/class.model';
import { Section } from '../models/section.model';
import { Subject } from '../models/subject.model';

@Injectable({ providedIn: 'root' })
export class SeedDataService {
  private storage = inject(StorageService);
  private tenantService = inject(TenantService);

  seed(): void {
    const tenantId = this.tenantService.getTenantId();

    const existing = this.storage.get<AcademicYear>('academic_years');
    if (existing.length === 0) {
      const academicYear: AcademicYear = {
        id: 'ay-2025-2026',
        tenantId,
        name: '2025-2026',
        startDate: '2025-06-01',
        endDate: '2026-03-31',
        isActive: true
      };
      this.storage.set('academic_years', [academicYear]);

      const classes: Class[] = [
        { id: 'cls-1', tenantId, name: 'Class 1', academicYearId: 'ay-2025-2026', displayOrder: 1 },
        { id: 'cls-2', tenantId, name: 'Class 2', academicYearId: 'ay-2025-2026', displayOrder: 2 },
        { id: 'cls-3', tenantId, name: 'Class 3', academicYearId: 'ay-2025-2026', displayOrder: 3 },
        { id: 'cls-4', tenantId, name: 'Class 4', academicYearId: 'ay-2025-2026', displayOrder: 4 },
        { id: 'cls-5', tenantId, name: 'Class 5', academicYearId: 'ay-2025-2026', displayOrder: 5 }
      ];
      this.storage.set('classes', classes);

      const sections: Section[] = [];
      classes.forEach(cls => {
        ['A', 'B'].forEach(sName => {
          sections.push({
            id: `sec-${cls.id}-${sName.toLowerCase()}`,
            tenantId,
            classId: cls.id,
            name: sName,
            classTeacherId: '',
            maxStudents: 40
          });
        });
      });
      this.storage.set('sections', sections);

      const subjects: Subject[] = [
        { id: 'sub-math', tenantId, name: 'Mathematics', code: 'MATH', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'] },
        { id: 'sub-eng', tenantId, name: 'English', code: 'ENG', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'] },
        { id: 'sub-sci', tenantId, name: 'Science', code: 'SCI', classIds: ['cls-3', 'cls-4', 'cls-5'] },
        { id: 'sub-tam', tenantId, name: 'Tamil', code: 'TAM', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'] },
        { id: 'sub-soc', tenantId, name: 'Social Studies', code: 'SOC', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'] }
      ];
      this.storage.set('subjects', subjects);
    }
  }
}
