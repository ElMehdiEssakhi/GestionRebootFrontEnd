import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { RebootAlert } from '../models/reboot-alert.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
@Component({
  selector: 'app-manager-dashboard',
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './manager-dashboard.component.html',
})
export class ManagerDashboardComponent implements OnInit {
  user: String = "";
  usermail: String="";
  alerts: any[] = [];
  filteredAlerts: any[] = [];
  isLoading = true;
  searchTerm = '';
  sortField: keyof RebootAlert = 'zoneId';
  sortDirection: 'asc' | 'desc' = 'asc';
  statusFilter = 'all';
  zoneFilter = 'all';
  zones: string[] = [];

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.user =this.authService.getUserNAme();
    this.usermail = this.authService.getEmail();
    this.apiService.getAllZones().subscribe({
      next: (data: any[]) => {
        this.alerts = data;
        this.zones = [...new Set(data.map(a => a.zoneId))];
        this.applyFilters();
      },
      error: (err) => console.error('Fetch error:', err),
      complete: () => this.isLoading = false
    });
  }

  applyFilters() {
    
    this.filteredAlerts = this.alerts
      .filter(alert => {
        const matchesSearch = alert.machine.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                              alert.zoneId.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesStatus = this.statusFilter === 'all' || alert.status === this.statusFilter;
        const matchesZone = this.zoneFilter === 'all' || alert.zoneId === this.zoneFilter;
        return matchesSearch && matchesStatus && matchesZone;
      })
      .sort((a, b) => {
        const fieldA = (a[this.sortField] ?? '').toString().toLowerCase();
        const fieldB = (b[this.sortField] ?? '').toString().toLowerCase();
        if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }

  toggleSort(field: keyof RebootAlert) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(field: keyof RebootAlert): string | null {
    return this.sortField === field ? (this.sortDirection === 'asc' ? '↑' : '↓') : null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'manual': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'rebooted': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'postponed': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  }
}
