export interface Student {
  id: string;
  tenantId: string;
  name: string;
  rollNumber: string;
  classId: string;
  sectionId: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'Other';
  parentName: string;
  parentPhone: string;
  address: string;
  academicYearId: string;
}
