import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { User, LoginResult, JwtPayload } from '../models/user.model';
import { TenantService } from './tenant.service';
import { TOKEN_EXPIRY_MS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tenantService = inject(TenantService);

  login(email: string, password: string, tenantId: string): Observable<LoginResult> {
    return this.http.get<User[]>('/assets/mock/users.json').pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password && u.tenantId === tenantId);
        if (!user) {
          return { success: false, error: 'Invalid email or password' };
        }
        const token = this.generateToken(user);
        localStorage.setItem('access_token', token);
        return { success: true, token, user };
      })
    );
  }

  logout(): void {
    const slug = this.tenantService.getTenantSlug();
    localStorage.removeItem('access_token');
    this.router.navigate([`/${slug}/login`]);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<boolean> {
    const user = this.getCurrentUser();
    if (!user) return of(false);
    return this.http.get<User[]>('/assets/mock/users.json').pipe(
      map(users => {
        const found = users.find(u => u.id === user.id && u.password === oldPassword);
        if (!found) return false;
        const payload = this.decodeToken();
        if (!payload) return false;
        const newPayload: JwtPayload = { ...payload, isFirstLogin: false };
        const token = this.encodeToken(newPayload);
        localStorage.setItem('access_token', token);
        return true;
      })
    );
  }

  forgotPassword(_email: string): Observable<boolean> {
    return of(true);
  }

  verifyOtp(otp: string): Observable<boolean> {
    return of(otp.length === 6);
  }

  resetPassword(_email: string, _newPassword: string): Observable<boolean> {
    return of(true);
  }

  getCurrentUser(): JwtPayload | null {
    return this.decodeToken();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getRole(): string | null {
    return this.decodeToken()?.role ?? null;
  }

  decodeToken(): JwtPayload | null {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }

  private generateToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload: JwtPayload = {
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
      name: user.name,
      email: user.email,
      isFirstLogin: user.isFirstLogin,
      exp: Date.now() + TOKEN_EXPIRY_MS
    };
    return this.encodeToken(payload, header);
  }

  private encodeToken(payload: JwtPayload, header?: string): string {
    const h = header ?? btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const p = btoa(JSON.stringify(payload));
    // NOTE: This is a mock JWT for development only. Replace with real signing in production.
    const sig = btoa('fakesignature');
    return `${h}.${p}.${sig}`;
  }
}
