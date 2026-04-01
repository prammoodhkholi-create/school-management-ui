import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule],
  template: `<p-confirmDialog></p-confirmDialog>`,
})
export class ConfirmDialogComponent {}
