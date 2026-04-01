import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TenantService } from '../../../core/services/tenant.service';
import { handleImageError } from '../../../shared/utils/image.utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, PasswordModule, CheckboxModule, TranslateModule],
  template: `
    <div class="login-wrapper">
      <div class="login-left">
        <div class="login-form-container">
          <div class="school-header">
            <img [src]="tenantLogo" [alt]="schoolName" class="school-logo" (error)="onImgError($event)">
            <h1 class="school-name">{{ schoolName }}</h1>
          </div>
          <h2>{{ 'LOGIN.TITLE' | translate }}</h2>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-field">
              <label for="email">{{ 'LOGIN.EMAIL' | translate }}</label>
              <input id="email" type="email" pInputText formControlName="email" [placeholder]="'LOGIN.EMAIL' | translate" class="w-full">
              <small class="error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Valid email required
              </small>
            </div>
            <div class="form-field">
              <label for="password">{{ 'LOGIN.PASSWORD' | translate }}</label>
              <p-password id="password" formControlName="password" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" [placeholder]="'LOGIN.PASSWORD' | translate"></p-password>
              <small class="error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password required
              </small>
            </div>
            <div class="form-field checkbox-field">
              <p-checkbox formControlName="rememberMe" [binary]="true" inputId="rememberMe"></p-checkbox>
              <label for="rememberMe">{{ 'LOGIN.REMEMBER_ME' | translate }}</label>
            </div>
            <p-button type="submit" [label]="'LOGIN.LOGIN_BUTTON' | translate" styleClass="w-full" [loading]="loading" class="login-btn"></p-button>
            <div class="forgot-link">
              <a [routerLink]="'/' + tenantSlug + '/forgot-password'">{{ 'LOGIN.FORGOT_PASSWORD' | translate }}</a>
            </div>
          </form>
        </div>
      </div>
      <div class="login-right" [style.background-image]="bgImageStyle" [style.background]="bgFallback">
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper { display: flex; height: 100vh; }
    .login-left { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; background: white; }
    .login-form-container { width: 100%; max-width: 400px; }
    .school-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem; }
    .school-logo { width: 80px; height: 80px; object-fit: contain; margin-bottom: 0.75rem; }
    .school-name { font-size: 1.25rem; font-weight: 700; color: var(--primary-color); text-align: center; }
    h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; color: var(--text-color); }
    .form-field { margin-bottom: 1.25rem; }
    .form-field label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-color); }
    .error { color: #e53935; font-size: 0.8rem; }
    .checkbox-field { display: flex; align-items: center; gap: 0.5rem; }
    .login-btn { width: 100%; margin-top: 0.5rem; }
    .forgot-link { text-align: center; margin-top: 1rem; }
    .forgot-link a { color: var(--primary-color); text-decoration: none; }
    .login-right { flex: 1; background-size: cover; background-position: center; }
    @media (max-width: 768px) { .login-right { display: none; } }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm!: FormGroup;
  loading = false;

  get tenantSlug(): string { return this.tenantService.getTenantSlug(); }
  get schoolName(): string { return this.tenantService.currentTenant()?.schoolName ?? 'School'; }
  get tenantLogo(): string { return this.tenantService.currentTenant()?.logo ?? ''; }
  get bgImageStyle(): string {
    const img = this.tenantService.currentTenant()?.loginBgImage;
    return img ? `url(${img})` : '';
  }
  get bgFallback(): string {
    const p = this.tenantService.currentTenant()?.primaryColor ?? '#2E7D32';
    const s = this.tenantService.currentTenant()?.secondaryColor ?? '#1565C0';
    return `linear-gradient(135deg, ${p}, ${s})`;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.value;
    const tenantId = this.tenantService.getTenantId();

    this.authService.login(email, password, tenantId).subscribe({
      next: result => {
        this.loading = false;
        if (result.success && result.user) {
          if (result.user.isFirstLogin) {
            this.router.navigate([`/${this.tenantSlug}/change-password`]);
          } else {
            this.router.navigate([`/${this.tenantSlug}/dashboard`]);
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password', life: 4000 });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed', life: 4000 });
      }
    });
  }

  onImgError(event: Event): void { handleImageError(event); }
}
