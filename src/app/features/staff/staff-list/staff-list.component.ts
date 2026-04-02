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
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { TableConfig, TableFilterEvent } from '../../../shared/components/data-table/data-table.models';
import { Staff } from '../../../core/models/staff.model';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonModule, ToastModule, ConfirmDialogModule, DataTableComponent],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class StaffListComponent implements OnInit {
  private storage = inject(StorageService);
  private tenantService = inject(TenantService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private translate = inject(TranslateService);

  allData: any[] = [];
  data: any[] = [];
  loading = false;
  subjects: Subject[] = [];

  tableConfig: TableConfig = {
    columns: [
      { field: 'name', header: 'STAFF.NAME', sortable: true, filterable: true, filterType: 'text' },
      { field: 'email', header: 'STAFF.EMAIL', filterable: true, filterType: 'text' },
      { field: 'phone', header: 'STAFF.PHONE' },
      { field: 'role', header: 'STAFF.ROLE', filterable: true, filterType: 'dropdown',
        filterOptions: [{ label: 'ADMIN', value: 'ADMIN' }, { label: 'TEACHER', value: 'TEACHER' }],
        type: 'badge',
        badgeMap: {
          'ADMIN': { label: 'Admin', severity: 'danger' },
          'TEACHER': { label: 'Teacher', severity: 'info' }
        }
      },
      { field: 'subjectNames', header: 'STAFF.SUBJECTS', type: 'list' },
      { field: 'qualification', header: 'STAFF.QUALIFICATION' },
      { field: 'joiningDate', header: 'STAFF.JOINING_DATE', type: 'date', sortable: true }
    ],
    globalSearch: true,
    paginator: true,
    rowsPerPage: [10, 25, 50],
    defaultRows: 10,
    actions: ['view', 'edit', 'delete'],
    showAddButton: true,
    addButtonLabel: 'STAFF.ADD',
    emptyMessage: 'TABLE.NO_RECORDS'
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.subjects = this.storage.get<Subject>('subjects');
    const staff = this.storage.get<Staff>('staff');
    this.allData = staff.map(s => ({
      ...s,
      subjectNames: (s.subjectIds ?? []).map(id => this.subjects.find(sub => sub.id === id)?.name ?? id)
    }));
    this.data = [...this.allData];
  }

  onFilter(event: TableFilterEvent): void {
    let result = [...this.allData];
    if (event.globalSearch) {
      const q = event.globalSearch.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q)
      );
    }
    const cf = event.columnFilters;
    if (cf['name']) result = result.filter(r => r.name.toLowerCase().includes(cf['name'].toLowerCase()));
    if (cf['email']) result = result.filter(r => r.email.toLowerCase().includes(cf['email'].toLowerCase()));
    if (cf['role']) result = result.filter(r => r.role === cf['role']);
    this.data = result;
  }

  onAdd(): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/staff/create`]);
  }

  onView(row: Staff): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/staff/view/${row.id}`]);
  }

  onEdit(row: Staff): void {
    const slug = this.tenantService.getTenantSlug();
    this.router.navigate([`/${slug}/staff/edit/${row.id}`]);
  }

  onDelete(row: Staff): void {
    this.confirmationService.confirm({
      message: this.translate.instant('STAFF.CONFIRM_DELETE'),
      accept: () => {
        this.storage.delete('staff', row.id);
        this.loadData();
        this.messageService.add({ severity: 'success', summary: this.translate.instant('SETUP.SUCCESS'), detail: this.translate.instant('STAFF.DELETED'), life: 3000 });
      }
    });
  }
}
