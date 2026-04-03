import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StorageService } from '../../../core/services/storage.service';
import { TenantService } from '../../../core/services/tenant.service';
import { SetupBannerComponent } from '../../../shared/components/setup-banner/setup-banner.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { TableConfig, TableFilterEvent } from '../../../shared/components/data-table/data-table.models';
import { Student } from '../../../core/models/student.model';
import { Class } from '../../../core/models/class.model';
import { Section } from '../../../core/models/section.model';
import { AcademicYear } from '../../../core/models/academic-year.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, ToastModule, ConfirmDialogModule, DataTableComponent, SetupBannerComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class StudentListComponent implements OnInit {
  private storage = inject(StorageService);
  private tenantService = inject(TenantService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translate = inject(TranslateService);

  allData: any[] = [];
  data: any[] = [];
  loading = false;
  hasSetup = false;
  classes: Class[] = [];
  sections: Section[] = [];

  tableConfig: TableConfig = {
    columns: [
      { field: 'name', header: 'STUDENTS.NAME', sortable: true, filterable: true, filterType: 'text' },
      { field: 'rollNumber', header: 'STUDENTS.ROLL_NUMBER', sortable: true, filterable: true, filterType: 'text' },
      { field: 'className', header: 'STUDENTS.CLASS', filterable: true, filterType: 'dropdown', filterOptions: [] },
      { field: 'sectionName', header: 'STUDENTS.SECTION', filterable: true, filterType: 'dropdown', filterOptions: [] },
      { field: 'gender', header: 'STUDENTS.GENDER', filterable: true, filterType: 'dropdown', filterOptions: [
        { label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }, { label: 'Other', value: 'Other' }
      ]},
      { field: 'parentName', header: 'STUDENTS.PARENT_NAME' },
      { field: 'parentPhone', header: 'STUDENTS.PARENT_PHONE' },
      { field: 'createdBy', header: 'AUDIT.CREATED_BY', sortable: true, width: '120px' },
      { field: 'createdDate', header: 'AUDIT.CREATED_DATE', type: 'date', dateFormat: 'medium', sortable: true, width: '160px' },
      { field: 'updatedBy', header: 'AUDIT.UPDATED_BY', sortable: true, width: '120px' },
      { field: 'updatedDate', header: 'AUDIT.UPDATED_DATE', type: 'date', dateFormat: 'medium', sortable: true, width: '160px' }
    ],
    globalSearch: true,
    paginator: true,
    rowsPerPage: [10, 25, 50],
    defaultRows: 10,
    actions: ['edit', 'delete', 'view'],
    showAddButton: true,
    addButtonLabel: 'STUDENTS.ADD',
    emptyMessage: 'TABLE.NO_RECORDS'
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const years = this.storage.get<AcademicYear>('academic_years');
    const active = years.find(y => y.isActive);
    this.classes = this.storage.get<Class>('classes');
    this.sections = this.storage.get<Section>('sections');
    this.hasSetup = this.classes.length > 0 && this.sections.length > 0;

    // Update filter options
    this.tableConfig.columns[2].filterOptions = this.classes.map(c => ({ label: c.name, value: c.id }));
    this.tableConfig.columns[3].filterOptions = this.sections.map(s => ({ label: s.name, value: s.id }));

    const students = this.storage.get<Student>('students');
    const filtered = active ? students.filter(s => s.academicYearId === active.id) : students;
    this.allData = filtered.map(s => ({
      ...s,
      className: this.classes.find(c => c.id === s.classId)?.name ?? s.classId,
      sectionName: this.sections.find(sec => sec.id === s.sectionId)?.name ?? s.sectionId
    }));
    this.data = [...this.allData];
  }

  onFilter(event: TableFilterEvent): void {
    let result = [...this.allData];
    if (event.globalSearch) {
      const q = event.globalSearch.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        r.parentName?.toLowerCase().includes(q)
      );
    }
    const cf = event.columnFilters;
    if (cf['name']) result = result.filter(r => r.name.toLowerCase().includes(cf['name'].toLowerCase()));
    if (cf['rollNumber']) result = result.filter(r => r.rollNumber.toLowerCase().includes(cf['rollNumber'].toLowerCase()));
    if (cf['className']) result = result.filter(r => r.classId === cf['className']);
    if (cf['sectionName']) result = result.filter(r => r.sectionId === cf['sectionName']);
    if (cf['gender']) result = result.filter(r => r.gender === cf['gender']);
    this.data = result;
  }

  onAdd(): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/students/create`]);
  }

  onEdit(row: Student): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/students/edit/${row.id}`]);
  }

  onView(row: Student): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/students/view/${row.id}`]);
  }

  onDelete(row: Student): void {
    this.confirmationService.confirm({
      message: this.translate.instant('STUDENTS.CONFIRM_DELETE'),
      accept: () => {
        this.storage.delete('students', row.id);
        this.loadData();
        this.messageService.add({ severity: 'success', summary: this.translate.instant('SETUP.SUCCESS'), detail: this.translate.instant('STUDENTS.DELETED'), life: 3000 });
      }
    });
  }
}
