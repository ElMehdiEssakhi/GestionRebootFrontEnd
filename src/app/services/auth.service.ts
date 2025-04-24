import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: 'manager' | 'technician';
    zoneIds?: string[]; // Only for technician
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap((res) => {
        localStorage.setItem('role', res.role);
        localStorage.setItem('zone', res.zone);
        localStorage.setItem('username',res.name);
        localStorage.setItem('email',res.email);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('role');
    localStorage.removeItem('zone');
  }

  getRole(): 'manager' | 'technician' | null {
    return localStorage.getItem('role') as 'manager' | 'technician' | null;
  }

  getZone(): String {
    return localStorage.getItem('zone') || '';
  }

  getUserNAme():String {
    return localStorage.getItem('username') || '';
  }
  getEmail():String {
    return localStorage.getItem('email') || '';
  }
}
