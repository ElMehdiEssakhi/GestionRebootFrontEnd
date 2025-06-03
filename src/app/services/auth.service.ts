import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(
      `${this.apiUrl}api/auth/login`,
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


}
