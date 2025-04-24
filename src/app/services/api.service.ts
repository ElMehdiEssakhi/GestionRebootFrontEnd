import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}


  private handleError(error: any): Observable<never> {
    console.error('API error:', error);

    if (error.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return throwError(() => new Error('Failed to fetch data. Please try again later.'));
  }

  getAllZones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`)
  }

  getPendingRebootsByZone(zoneId: String): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending/currentZone?zone=${zoneId}`, );
  }


  markRebootAsManual(userId: String,rebootId: Number){
    console.log(userId)
    console.log(rebootId)
    return this.http.patch<any>(`${this.apiUrl}/pending/check`,
      {userId, rebootId  }).pipe(catchError(this.handleError));
  }

}
