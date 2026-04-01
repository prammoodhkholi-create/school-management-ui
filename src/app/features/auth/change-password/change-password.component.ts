import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';

function passwordMatchValidator(control: AbstractControl) {
  const newPwd = control.get('newPassword')?.value;
  const confirmPwd = control.get('confirmPassword')?.value;
  return newPwd === confirmPwd ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, PasswordModule, TranslateModule],
  template: `
    <div class="change-password-wrapper">
      <p-card styleClass="change-password-card">
        <div class="card-header">
          <img [src]="tenantLogo" [alt]="schoolName" class="school-logo" (error)="onImgError($event)">
          <h2>{{ schoolName }}</h2>
          <h3>{{ 'CHANGE_PASSWORD.TITLE' | translate }}</h3>
        </div>
        <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label>{{ 'CHANGE_PASSWORD.CURRENT_PASSWORD' | translate }}</label>
            <p-password formControlName="currentPassword" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
          </div>
          <div class="form-field">
            <label>{{ 'CHANGE_PASSWORD.NEW_PASSWORD' | translate }}</label>
            <p-password formControlName="newPassword" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
            <small class="error" *ngIf="changePasswordForm.get('newPassword')?.hasError('minlength') && changePasswordForm.get('newPassword')?.touched">
              {{ 'CHANGE_PASSWORD.MIN_LENGTH' | translate }}
            </small>
          </div>
          <div class="form-field">
            <label>{{ 'CHANGE_PASSWORD.CONFIRM_PASSWORD' | translate }}</label>
            <p-password formControlName="confirmPassword" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
            <small class="error" *ngIf="changePasswordForm.hasError('passwordMismatch') && changePasswordForm.get('confirmPassword')?.touched">
              {{ 'CHANGE_PASSWORD.MISMATCH' | translate }}
            </small>
          </div>
          <div class="btn-group">
            <p-button type="submit" [label]="'CHANGE_PASSWORD.SUBMIT' | translate" [loading]="loading"></p-button>
            <p-button type="button" [label]="'CHANGE_PASSWORD.CANCEL' | translate" severity="secondary" (onClick)="onCancel()"></p-button>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .change-password-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--surface-ground); padding: 1rem; }
    .card-header { text-align: center; margin-bottom: 1.5rem; }
    .school-logo { width: 64px; height: 64px; object-fit: contain; margin-bottom: 0.5rem; }
    .form-field { margin-bottom: 1.25rem; }
    .form-field label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .error { color: #e53935; font-size: 0.8rem; }
    .btn-group { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
  `]
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  changePasswordForm!: FormGroup;
  loading = false;

  get tenantSlug(): string { return this.tenantService.getTenantSlug(); }
  get schoolName(): string { return this.tenantService.currentTenant()?.schoolName ?? ''; }
  get tenantLogo(): string { return this.tenantService.currentTenant()?.logo ?? ''; }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: success => {
        this.loading = false;
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password changed successfully', life: 3000 });
          setTimeout(() => this.router.navigate([`/${this.tenantSlug}/dashboard`]), 1500);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Current password is incorrect', life: 4000 });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to change password', life: 4000 });
      }
    });
  }

  onCancel(): void { this.authService.logout(); }
  onImgError(event: Event): void { (event.target as HTMLImageElement).style.display = 'none'; }
}
