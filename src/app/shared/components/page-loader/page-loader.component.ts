import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="page-loader">
      <p-progressSpinner></p-progressSpinner>
    </div>
  `,
  styles: [`
    .page-loader {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.8);
      z-index: 9999;
    }
  `]
})
export class PageLoaderComponent {}
