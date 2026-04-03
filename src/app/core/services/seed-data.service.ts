import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { TenantService } from './tenant.service';
import { AcademicYear } from '../models/academic-year.model';
import { Class } from '../models/class.model';
import { Section } from '../models/section.model';
import { Subject } from '../models/subject.model';
import { Student } from '../models/student.model';
import { Staff } from '../models/staff.model';
import { User } from '../models/user.model';
import { AttendanceRecord } from '../models/attendance.model';
import { TimetableSlot } from '../models/timetable.model';
import { SchoolEvent } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class SeedDataService {
  private storage = inject(StorageService);
  private tenantService = inject(TenantService);

  private readonly SYSTEM_AUDIT = {
    createdBy: 'System',
    createdDate: new Date().toISOString(),
    updatedBy: 'System',
    updatedDate: new Date().toISOString()
  };

  seed(): void {
    const tenantId = this.tenantService.getTenantId();

    if (this.storage.get<User>('users').length === 0) {
      this.seedUsers(tenantId);
    }

    const existing = this.storage.get<AcademicYear>('academic_years');
    if (existing.length === 0) {
      this.seedSetupData(tenantId);
    }

    if (this.storage.get<Student>('students').length === 0) {
      this.seedStudents(tenantId);
    }

    if (this.storage.get<Staff>('staff').length === 0) {
      this.seedStaff(tenantId);
    }

    if (this.storage.get<AttendanceRecord>('attendance').length === 0) {
      this.seedAttendance(tenantId);
    }

    if (this.storage.get<TimetableSlot>('timetable').length === 0) {
      this.seedTimetable(tenantId);
    }

    if (this.storage.get<SchoolEvent>('events').length === 0) {
      this.seedEvents(tenantId);
    }
  }

  private seedSetupData(tenantId: string): void {
    const academicYear: AcademicYear = {
      id: 'ay-2025-2026',
      tenantId,
      name: '2025-2026',
      startDate: '2025-06-01',
      endDate: '2026-03-31',
      isActive: true,
      ...this.SYSTEM_AUDIT
    };
    this.storage.set('academic_years', [academicYear]);

    const classes: Class[] = [
      { id: 'cls-1', tenantId, name: 'Class 1', academicYearId: 'ay-2025-2026', displayOrder: 1, ...this.SYSTEM_AUDIT },
      { id: 'cls-2', tenantId, name: 'Class 2', academicYearId: 'ay-2025-2026', displayOrder: 2, ...this.SYSTEM_AUDIT },
      { id: 'cls-3', tenantId, name: 'Class 3', academicYearId: 'ay-2025-2026', displayOrder: 3, ...this.SYSTEM_AUDIT },
      { id: 'cls-4', tenantId, name: 'Class 4', academicYearId: 'ay-2025-2026', displayOrder: 4, ...this.SYSTEM_AUDIT },
      { id: 'cls-5', tenantId, name: 'Class 5', academicYearId: 'ay-2025-2026', displayOrder: 5, ...this.SYSTEM_AUDIT }
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
          maxStudents: 40,
          ...this.SYSTEM_AUDIT
        });
      });
    });
    this.storage.set('sections', sections);

    const subjects: Subject[] = [
      { id: 'sub-math', tenantId, name: 'Mathematics', code: 'MATH', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'], ...this.SYSTEM_AUDIT },
      { id: 'sub-eng', tenantId, name: 'English', code: 'ENG', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'], ...this.SYSTEM_AUDIT },
      { id: 'sub-sci', tenantId, name: 'Science', code: 'SCI', classIds: ['cls-3', 'cls-4', 'cls-5'], ...this.SYSTEM_AUDIT },
      { id: 'sub-tam', tenantId, name: 'Tamil', code: 'TAM', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'], ...this.SYSTEM_AUDIT },
      { id: 'sub-soc', tenantId, name: 'Social Studies', code: 'SOC', classIds: ['cls-1', 'cls-2', 'cls-3', 'cls-4', 'cls-5'], ...this.SYSTEM_AUDIT }
    ];
    this.storage.set('subjects', subjects);
  }

  private seedStudents(tenantId: string): void {
    const students: Student[] = [
      { id: 'stu-001', tenantId, name: 'Arjun Kumar', rollNumber: '1A01', classId: 'cls-1', sectionId: 'sec-cls-1-a', dateOfBirth: '2017-03-15', gender: 'M', parentName: 'Ravi Kumar', parentPhone: '9876543210', address: '12 Main St, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-002', tenantId, name: 'Priya Devi', rollNumber: '1A02', classId: 'cls-1', sectionId: 'sec-cls-1-a', dateOfBirth: '2017-06-22', gender: 'F', parentName: 'Suresh Devi', parentPhone: '9876543211', address: '34 Cross St, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-003', tenantId, name: 'Karthik Raj', rollNumber: '1B01', classId: 'cls-1', sectionId: 'sec-cls-1-b', dateOfBirth: '2017-09-10', gender: 'M', parentName: 'Murugan Raj', parentPhone: '9876543212', address: '56 Park Ave, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-004', tenantId, name: 'Meena Selvi', rollNumber: '2A01', classId: 'cls-2', sectionId: 'sec-cls-2-a', dateOfBirth: '2016-01-18', gender: 'F', parentName: 'Selvam K', parentPhone: '9876543213', address: '78 Lake View, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-005', tenantId, name: 'Vijay Prasad', rollNumber: '2A02', classId: 'cls-2', sectionId: 'sec-cls-2-a', dateOfBirth: '2016-05-25', gender: 'M', parentName: 'Prasad S', parentPhone: '9876543214', address: '90 Garden Rd, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-006', tenantId, name: 'Anitha Rani', rollNumber: '2B01', classId: 'cls-2', sectionId: 'sec-cls-2-b', dateOfBirth: '2016-11-30', gender: 'F', parentName: 'Rani P', parentPhone: '9876543215', address: '11 Hill St, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-007', tenantId, name: 'Surya Krishnan', rollNumber: '3A01', classId: 'cls-3', sectionId: 'sec-cls-3-a', dateOfBirth: '2015-04-12', gender: 'M', parentName: 'Krishnan M', parentPhone: '9876543216', address: '22 Temple Rd, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-008', tenantId, name: 'Kavitha Mohan', rollNumber: '3A02', classId: 'cls-3', sectionId: 'sec-cls-3-a', dateOfBirth: '2015-08-19', gender: 'F', parentName: 'Mohan K', parentPhone: '9876543217', address: '33 River View, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-009', tenantId, name: 'Dinesh Babu', rollNumber: '3B01', classId: 'cls-3', sectionId: 'sec-cls-3-b', dateOfBirth: '2015-12-05', gender: 'M', parentName: 'Babu D', parentPhone: '9876543218', address: '44 North St, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-010', tenantId, name: 'Lakshmi Patel', rollNumber: '1A03', classId: 'cls-1', sectionId: 'sec-cls-1-a', dateOfBirth: '2017-07-14', gender: 'F', parentName: 'Patel R', parentPhone: '9876543219', address: '55 South St, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-011', tenantId, name: 'Rahul Singh', rollNumber: '2B02', classId: 'cls-2', sectionId: 'sec-cls-2-b', dateOfBirth: '2016-02-28', gender: 'M', parentName: 'Singh A', parentPhone: '9876543220', address: '66 East Ave, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stu-012', tenantId, name: 'Deepa Nair', rollNumber: '3B02', classId: 'cls-3', sectionId: 'sec-cls-3-b', dateOfBirth: '2015-09-22', gender: 'F', parentName: 'Nair V', parentPhone: '9876543221', address: '77 West Blvd, Chennai', academicYearId: 'ay-2025-2026', photoUrl: '', ...this.SYSTEM_AUDIT }
    ];
    this.storage.set('students', students);
  }

  private seedStaff(tenantId: string): void {
    const staff: Staff[] = [
      { id: 'stf-001', tenantId, name: 'Dr. Ramesh Sharma', email: 'ramesh@greenvalley.edu', phone: '9800001111', role: 'ADMIN', subjectIds: [], qualification: 'M.Ed, Ph.D', joiningDate: '2018-06-01', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stf-002', tenantId, name: 'Mrs. Anitha Krishnan', email: 'anitha@greenvalley.edu', phone: '9800002222', role: 'TEACHER', subjectIds: ['sub-math', 'sub-sci'], qualification: 'B.Ed, M.Sc', joiningDate: '2019-07-15', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stf-003', tenantId, name: 'Mr. Suresh Babu', email: 'suresh@greenvalley.edu', phone: '9800003333', role: 'TEACHER', subjectIds: ['sub-eng'], qualification: 'B.Ed, M.A English', joiningDate: '2020-06-10', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stf-004', tenantId, name: 'Ms. Kavitha Rajan', email: 'kavitha@greenvalley.edu', phone: '9800004444', role: 'TEACHER', subjectIds: ['sub-tam', 'sub-soc'], qualification: 'B.Ed, M.A Tamil', joiningDate: '2021-08-01', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stf-005', tenantId, name: 'Mr. Murugan Pillai', email: 'murugan@greenvalley.edu', phone: '9800005555', role: 'TEACHER', subjectIds: ['sub-sci', 'sub-math'], qualification: 'B.Ed, M.Sc Physics', joiningDate: '2022-06-05', photoUrl: '', ...this.SYSTEM_AUDIT },
      { id: 'stf-006', tenantId, name: 'Mrs. Priya Venkat', email: 'priya@greenvalley.edu', phone: '9800006666', role: 'ADMIN', subjectIds: [], qualification: 'MBA, B.Com', joiningDate: '2020-09-01', photoUrl: '', ...this.SYSTEM_AUDIT }
    ];
    this.storage.set('staff', staff);
  }

  private seedAttendance(tenantId: string): void {
    const students = this.storage.get<Student>('students');
    const cls1aStudents = students.filter(s => s.classId === 'cls-1' && s.sectionId === 'sec-cls-1-a');
    const records: AttendanceRecord[] = [];
    const statuses: ('PRESENT' | 'ABSENT' | 'LATE')[] = ['PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE'];

    for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const dateStr = date.toISOString().split('T')[0];

      cls1aStudents.forEach((student, idx) => {
        records.push({
          id: `att-${student.id}-${dateStr}`,
          tenantId,
          studentId: student.id,
          date: dateStr,
          status: statuses[idx % statuses.length],
          period: 0,
          subjectId: '',
          ...this.SYSTEM_AUDIT
        });
      });
    }
    this.storage.set('attendance', records);
  }

  private seedTimetable(tenantId: string): void {
    const slots: TimetableSlot[] = [
      { id: 'tt-cls1a-mon-1', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Monday', period: 1, subjectId: 'sub-math', staffId: 'stf-002', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-mon-2', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Monday', period: 2, subjectId: 'sub-eng', staffId: 'stf-003', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-mon-3', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Monday', period: 3, subjectId: 'sub-tam', staffId: 'stf-004', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-mon-4', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Monday', period: 4, subjectId: 'sub-soc', staffId: 'stf-004', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-tue-1', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Tuesday', period: 1, subjectId: 'sub-eng', staffId: 'stf-003', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-tue-2', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Tuesday', period: 2, subjectId: 'sub-math', staffId: 'stf-002', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-tue-3', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Tuesday', period: 3, subjectId: 'sub-tam', staffId: 'stf-004', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-wed-1', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Wednesday', period: 1, subjectId: 'sub-math', staffId: 'stf-002', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-wed-2', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Wednesday', period: 2, subjectId: 'sub-eng', staffId: 'stf-003', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-wed-3', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Wednesday', period: 3, subjectId: 'sub-soc', staffId: 'stf-004', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-thu-1', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Thursday', period: 1, subjectId: 'sub-tam', staffId: 'stf-004', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-thu-2', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Thursday', period: 2, subjectId: 'sub-math', staffId: 'stf-002', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-thu-3', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Thursday', period: 3, subjectId: 'sub-eng', staffId: 'stf-003', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-fri-1', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Friday', period: 1, subjectId: 'sub-eng', staffId: 'stf-003', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-fri-2', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Friday', period: 2, subjectId: 'sub-tam', staffId: 'stf-004', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-fri-3', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Friday', period: 3, subjectId: 'sub-math', staffId: 'stf-002', ...this.SYSTEM_AUDIT },
      { id: 'tt-cls1a-fri-4', tenantId, classId: 'cls-1', sectionId: 'sec-cls-1-a', day: 'Friday', period: 4, subjectId: 'sub-soc', staffId: 'stf-004', ...this.SYSTEM_AUDIT }
    ];
    this.storage.set('timetable', slots);
  }

  private seedEvents(tenantId: string): void {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const nm = m === 12 ? 1 : m + 1;
    const ny = m === 12 ? y + 1 : y;
    const pad = (n: number) => String(n).padStart(2, '0');

    const events: SchoolEvent[] = [
      { id: 'evt-001', tenantId, title: 'Pongal Holiday', description: 'Thai Pongal celebration', type: 'holiday', startDate: `${y}-${pad(m)}-14`, endDate: `${y}-${pad(m)}-15`, forRoles: ['ADMIN', 'TEACHER', 'STUDENT'], ...this.SYSTEM_AUDIT },
      { id: 'evt-002', tenantId, title: 'Republic Day', description: 'National Republic Day celebration', type: 'holiday', startDate: `${y}-01-26`, endDate: `${y}-01-26`, forRoles: ['ADMIN', 'TEACHER', 'STUDENT'], ...this.SYSTEM_AUDIT },
      { id: 'evt-003', tenantId, title: 'Unit Test - Class 1-3', description: 'First unit test for classes 1 to 3', type: 'exam', startDate: `${y}-${pad(m)}-20`, endDate: `${y}-${pad(m)}-22`, forRoles: ['ADMIN', 'TEACHER', 'STUDENT'], ...this.SYSTEM_AUDIT },
      { id: 'evt-004', tenantId, title: 'Sports Day', description: 'Annual sports day event', type: 'event', startDate: `${ny}-${pad(nm)}-05`, endDate: `${ny}-${pad(nm)}-05`, forRoles: ['ADMIN', 'TEACHER', 'STUDENT'], ...this.SYSTEM_AUDIT },
      { id: 'evt-005', tenantId, title: 'Parent-Teacher Meeting', description: 'Q1 parent teacher interaction', type: 'event', startDate: `${ny}-${pad(nm)}-10`, endDate: `${ny}-${pad(nm)}-10`, forRoles: ['ADMIN', 'TEACHER'], ...this.SYSTEM_AUDIT },
      { id: 'evt-006', tenantId, title: 'Half-Year Exams', description: 'Half-yearly examination for all classes', type: 'exam', startDate: `${ny}-${pad(nm)}-15`, endDate: `${ny}-${pad(nm)}-20`, forRoles: ['ADMIN', 'TEACHER', 'STUDENT'], ...this.SYSTEM_AUDIT },
      { id: 'evt-007', tenantId, title: 'Annual Day', description: 'School annual day celebration with cultural events', type: 'event', startDate: `${ny}-${pad(nm)}-25`, endDate: `${ny}-${pad(nm)}-25`, forRoles: ['ADMIN', 'TEACHER', 'STUDENT'], ...this.SYSTEM_AUDIT }
    ];
    this.storage.set('events', events);
  }

  private seedUsers(tenantId: string): void {
    // NOTE: Passwords are stored as plain text in localStorage (mock phase only).
    // In production, passwords must be hashed using bcrypt or similar.
    const users: User[] = [
      {
        id: 'user-001', tenantId, email: 'admin@greenvalley.edu', password: 'admin123',
        role: 'ADMIN', name: 'Admin User', staffId: 'stf-001', isFirstLogin: false, isActive: true
      },
      {
        id: 'user-002', tenantId, email: 'teacher@greenvalley.edu', password: 'teacher123',
        role: 'TEACHER', name: 'Teacher User', staffId: 'stf-002', isFirstLogin: false, isActive: true
      }
    ];
    this.storage.set('users', users);
  }
}
