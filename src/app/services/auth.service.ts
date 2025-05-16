import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://192.168.0.26:8080';
  private currentUserSubject = new BehaviorSubject<string>('');
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(
      `${this.apiUrl}/api/auth/login`,
      { username, password }
    ).pipe(
      tap((res) => {
        localStorage.setItem('role', res.role);
      })
    );
  }
  logout(): void {
    localStorage.removeItem('role');
    this.currentUserSubject.next('');
  }

  getRole(): String{
    return localStorage.getItem('role') || '';
  }

  setCurrentUser(user: string) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): string {
    return this.currentUserSubject.value;
  }

}
