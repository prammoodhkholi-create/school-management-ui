import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule, SkeletonModule, CardModule],
  template: `
    <p-card>
      <p-skeleton height="2rem" styleClass="mb-2"></p-skeleton>
      <p-skeleton height="1rem" styleClass="mb-2"></p-skeleton>
      <p-skeleton height="1rem" styleClass="mb-2"></p-skeleton>
      <p-skeleton height="1rem"></p-skeleton>
    </p-card>
  `
})
export class SkeletonCardComponent {}
