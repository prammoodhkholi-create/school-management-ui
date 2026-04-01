export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  period?: number;
  subjectId?: string;
}
