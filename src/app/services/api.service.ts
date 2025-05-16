import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, of } from 'rxjs';
import { Technician } from '../models/technician';
import { ZoneStats } from '../models/ZoneStats';
import { Alert } from '../models/alerts.model';
import { Machine } from '../models/machine';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://192.168.0.26:8080/';
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

  getAllReboots(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}reboot/All`)
  }

  getPendingRebootsByZone(site: String): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}reboot/pending?site=${site}`, );
  }


  markRebootAsManual(rebootedBy: String,rebootId: Number){
    return this.http.patch<any>(`${this.apiUrl}reboot/check`,
      {rebootedBy, rebootId}).pipe(catchError(this.handleError));
  }

  getRebootsByDate(date: String): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}reboot/byDate?date=${date}`);
  }
  getAlerts(){
    return this.http.get<any>(`${this.apiUrl}reboot/alerts`);
  }

  getTechs(){
    return this.http.get<Technician>(`${this.apiUrl}tech/getAll`);
  }

  deleteTech(tech: Technician): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}tech/delete`,{ body:tech })
      .pipe(catchError(this.handleError));
  }

  addTechnician(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tech/add`, { name })
      .pipe(catchError(this.handleError));
  }
  getMachines(){
    return this.http.get<Machine>(`${this.apiUrl}machine/getAll`);
  }
  getTotalAutoReboots(){
    return this.http.get<number>(`${this.apiUrl}machine/getSumAuto`);
  }
  getTotalManualReboots(){
    return this.http.get<number>(`${this.apiUrl}machine/getSumManual`);
  }
  getTotalAutoRebootsBySites(){
    return this.http.get<ZoneStats[]>(`${this.apiUrl}machine/getSumAutoByZones`);
  }
  getTotalManualRebootsBySites(){
    return this.http.get<ZoneStats[]>(`${this.apiUrl}machine/getSumManualByZones`);
  }
  getTotalAlertsBySites(){
    return this.http.get<Alert[]>(`${this.apiUrl}machine/getSumAlertsByZones`);
  }
  addMachine(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}machine/add`, { name })
      .pipe(catchError(this.handleError));
  }
  
}
