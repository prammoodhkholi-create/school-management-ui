export interface SchoolEvent {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'holiday' | 'exam' | 'event';
  forRoles: string[];
}
