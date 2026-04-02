import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TableColumn, TableConfig, TableSortEvent, TableFilterEvent, TablePageEvent } from './data-table.models';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  imports: [
    CommonModule, FormsModule, TranslateModule,
    TableModule, ButtonModule, InputTextModule, DropdownModule,
    MultiSelectModule, CalendarModule, TagModule, TooltipModule
  ]
})
export class DataTableComponent implements OnInit, OnDestroy {
  @Input() config!: TableConfig;
  @Input() data: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() sortChange = new EventEmitter<TableSortEvent>();
  @Output() filterChange = new EventEmitter<TableFilterEvent>();
  @Output() pageChange = new EventEmitter<TablePageEvent>();
  @Output() addClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() viewClick = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter<any[]>();

  globalSearchValue = '';
  columnFilters: Record<string, any> = {};
  currentSort: { field: string; order: number } | null = null;
  booleanOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.emitFilter();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  get defaultRows(): number {
    return this.config?.defaultRows ?? 10;
  }

  get rowsPerPage(): number[] {
    return this.config?.rowsPerPage ?? [10, 25, 50];
  }

  get dataKey(): string {
    return this.config?.dataKey ?? 'id';
  }

  onGlobalSearch(value: string): void {
    this.globalSearchValue = value;
    this.searchSubject.next(value);
  }

  onColumnFilter(field: string, value: any): void {
    this.columnFilters[field] = value;
    this.emitFilter();
  }

  onSort(event: any): void {
    if (event.field) {
      this.sortChange.emit({ field: event.field, order: event.order === 1 ? 'asc' : 'desc' });
    }
  }

  onPage(event: any): void {
    this.pageChange.emit({ page: Math.floor(event.first / event.rows), rows: event.rows, first: event.first });
  }

  private emitFilter(): void {
    this.filterChange.emit({ globalSearch: this.globalSearchValue, columnFilters: { ...this.columnFilters } });
  }

  getBadgeLabel(col: TableColumn, value: any): string {
    const key = String(value);
    return col.badgeMap?.[key]?.label ?? key;
  }

  getBadgeSeverity(col: TableColumn, value: any): any {
    const key = String(value);
    return col.badgeMap?.[key]?.severity ?? 'info';
  }

  getListValue(value: any): string {
    if (Array.isArray(value)) return value.join(', ');
    return value ?? '';
  }

  hasFilterableColumns(): boolean {
    return this.config?.columns?.some(c => c.filterable) ?? false;
  }

  hasAction(action: 'edit' | 'delete' | 'view'): boolean {
    return this.config?.actions?.includes(action) ?? false;
  }
}
