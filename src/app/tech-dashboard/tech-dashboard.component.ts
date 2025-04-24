import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { RebootAlert } from '../models/reboot-alert.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-tech-dashboard',
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './tech-dashboard.component.html',
  styleUrl: './tech-dashboard.component.css'
})
export class TechDashboardComponent {
  user: String | null = null;
  usermail: String="";
  userZone:String ="";
  alerts: any[] = [];
  isLoading = true;
  searchTerm = '';
  sortField: keyof RebootAlert = 'machineName';
  sortDirection: 'asc' | 'desc' = 'asc';
  zoneFilter = 'all';

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.user =this.authService.getUserNAme();
    this.usermail = this.authService.getEmail();
    this.userZone = this.authService.getZone();
    this.Refresh();
    
  }
  manualReboot(alert: any) {
    // Set the removing flag to trigger animation
    alert.isRemoving = true;
    
    // Wait for animation to complete before making the API call
    setTimeout(() => {
      this.apiService.markRebootAsManual(this.usermail, alert.id).subscribe({
        next: () => {
          console.log('Reboot marked as manual successfully');
          // Remove the alert from the array after animation
          this.alerts = this.alerts.filter(a => a.id !== alert.id);
        },
        error: (err) => {
          console.error('Error marking reboot as manual:', err);
          // If there's an error, revert the animation
          alert.isRemoving = false;
        }
      });
    }, 300); // Match this with the CSS transition duration
  }
  Refresh(){
    this.apiService.getPendingRebootsByZone(this.userZone).subscribe({
      next: (data: any[]) => {
        this.alerts = data;
      },
      error: (err) => console.error('Fetch error:', err),
      complete: () => this.isLoading = false
    });
  }

  toggleSort(field: keyof RebootAlert) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  get filteredAlerts() {
    return this.alerts
      .filter(alert => {
        const matchesSearch = alert.machine.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesZone = this.zoneFilter === 'all' || alert.zoneId === this.zoneFilter;
        return matchesSearch && matchesZone;
      })
      .sort((a, b) => {
        const valA = a[this.sortField]?.toString().toLowerCase() || '';
        const valB = b[this.sortField]?.toString().toLowerCase() || '';
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }
}
