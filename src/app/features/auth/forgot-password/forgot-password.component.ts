import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { StepsModule } from 'primeng/steps';
import { MenuItem, MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';

function passwordMatchValidator(control: AbstractControl) {
  const newPwd = control.get('newPassword')?.value;
  const confirmPwd = control.get('confirmPassword')?.value;
  return newPwd === confirmPwd ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, PasswordModule, StepsModule, RouterLink, TranslateModule],
  template: `
    <div class="forgot-wrapper">
      <p-card styleClass="forgot-card">
        <h2>{{ 'FORGOT_PASSWORD.TITLE' | translate }}</h2>
        <p-steps [model]="steps" [activeIndex]="activeStep" [readonly]="true"></p-steps>

        <div *ngIf="activeStep === 0" class="step-content">
          <p>{{ 'FORGOT_PASSWORD.ENTER_EMAIL' | translate }}</p>
          <form [formGroup]="emailForm" (ngSubmit)="onSendOtp()">
            <div class="form-field">
              <label>{{ 'FORGOT_PASSWORD.EMAIL_STEP' | translate }}</label>
              <input type="email" pInputText formControlName="email" class="w-full">
            </div>
            <p-button type="submit" [label]="'FORGOT_PASSWORD.SEND_OTP' | translate" [loading]="loading" styleClass="w-full"></p-button>
          </form>
        </div>

        <div *ngIf="activeStep === 1" class="step-content">
          <p>{{ 'FORGOT_PASSWORD.ENTER_OTP' | translate }}</p>
          <form [formGroup]="otpForm" (ngSubmit)="onVerifyOtp()">
            <div class="form-field">
              <label>{{ 'FORGOT_PASSWORD.OTP_STEP' | translate }}</label>
              <input type="text" pInputText formControlName="otp" maxlength="6" class="w-full">
            </div>
            <p-button type="submit" [label]="'FORGOT_PASSWORD.VERIFY_OTP' | translate" [loading]="loading" styleClass="w-full"></p-button>
          </form>
        </div>

        <div *ngIf="activeStep === 2" class="step-content">
          <p>{{ 'FORGOT_PASSWORD.ENTER_NEW_PASSWORD' | translate }}</p>
          <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()">
            <div class="form-field">
              <label>{{ 'CHANGE_PASSWORD.NEW_PASSWORD' | translate }}</label>
              <p-password formControlName="newPassword" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
            </div>
            <div class="form-field">
              <label>{{ 'CHANGE_PASSWORD.CONFIRM_PASSWORD' | translate }}</label>
              <p-password formControlName="confirmPassword" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full"></p-password>
              <small class="error" *ngIf="resetForm.hasError('passwordMismatch') && resetForm.get('confirmPassword')?.touched">
                {{ 'CHANGE_PASSWORD.MISMATCH' | translate }}
              </small>
            </div>
            <p-button type="submit" [label]="'FORGOT_PASSWORD.RESET_BUTTON' | translate" [loading]="loading" styleClass="w-full"></p-button>
          </form>
        </div>

        <div class="back-link">
          <a [routerLink]="'/' + tenantSlug + '/login'">{{ 'FORGOT_PASSWORD.BACK_TO_LOGIN' | translate }}</a>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .forgot-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--surface-ground); padding: 1rem; }
    h2 { text-align: center; margin-bottom: 1.5rem; }
    .step-content { margin-top: 2rem; }
    .form-field { margin-bottom: 1.25rem; }
    .form-field label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .error { color: #e53935; font-size: 0.8rem; }
    .back-link { text-align: center; margin-top: 1.5rem; }
    .back-link a { color: var(--primary-color); text-decoration: none; }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  activeStep = 0;
  loading = false;
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  resetForm!: FormGroup;

  steps: MenuItem[] = [
    { label: 'Email' },
    { label: 'Verify OTP' },
    { label: 'New Password' }
  ];

  get tenantSlug(): string { return this.tenantService.getTenantSlug(); }

  ngOnInit(): void {
    this.emailForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
    this.otpForm = this.fb.group({ otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]] });
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSendOtp(): void {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.forgotPassword(this.emailForm.value.email).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP sent to your email', life: 3000 });
        this.activeStep = 1;
      }
    });
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) { this.otpForm.markAllAsTouched(); return; }
    this.loading = true;
    this.authService.verifyOtp(this.otpForm.value.otp).subscribe({
      next: success => {
        this.loading = false;
        if (success) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP verified', life: 3000 });
          this.activeStep = 2;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid OTP', life: 4000 });
        }
      }
    });
  }

  onResetPassword(): void {
    if (this.resetForm.invalid) { this.resetForm.markAllAsTouched(); return; }
    this.loading = true;
    const email = this.emailForm.value.email;
    this.authService.resetPassword(email, this.resetForm.value.newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfully', life: 3000 });
        setTimeout(() => this.router.navigate([`/${this.tenantSlug}/login`]), 1500);
      }
    });
  }
}
