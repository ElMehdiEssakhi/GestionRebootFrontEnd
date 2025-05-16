import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { RebootAlert } from '../models/reboot-alert.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { Mars } from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
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
  sortField: keyof RebootAlert = 'site';
  sortDirection: 'asc' | 'desc' = 'asc';
  statusFilter = 'all';
  siteFilter = 'all';
  sites: string[] = [];
  dateFilter = '';
  today = new Date();
  days: { label: string; value: string }[] = [];
  
  // Add Technician Modal Properties
  showAddTechModal = false;
  newTechName = '';
  isAddingTech = false;
  showTechSuccessMessage = false;
  showTechErrorMessage = false;
  techErrorMessage = '';

  isSidebarOpen = false;

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    const todayDate = this.today.getDate();
    // Add "Today" first
    this.days.push({
      label: 'Today',
      value: this.today.toLocaleDateString('en-CA') // 2025-04-28
    });
    // Add previous days
    for (let i = todayDate - 1; i >= 1; i--) {
      const day = new Date(this.today.getFullYear(),this.today.getMonth(), i);
      this.days.push({
        label: i.toString(),
        value: day.toLocaleDateString('en-CA') // 2025-04-27, 2025-04-26, ...
      });
    }
    // Set default value to today's date
    this.dateFilter = this.today.toLocaleDateString('en-CA');
    this.getByDate();
  }

  applyFilters() {
    
    this.filteredAlerts = this.alerts
      .filter(alert => {
        const matchesSearch = alert.machine.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                              alert.site.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesStatus = this.statusFilter === 'all' || alert.status === this.statusFilter;
        const matchesSite = this.siteFilter === 'all' || alert.site === this.siteFilter;
        return matchesSearch && matchesStatus && matchesSite;
      })
      .sort((a, b) => {
        if (this.sortField === 'machineName') {
          const nameA = a.machine.name.toLowerCase();
          const nameB = b.machine.name.toLowerCase();
          return this.sortDirection === 'asc' 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        } else if (this.sortField === 'rebootPostponedAt') {
          const timeA = new Date(a.rebootPostponedAt).getTime();
          const timeB = new Date(b.rebootPostponedAt).getTime();
          return this.sortDirection === 'asc' 
            ? timeA - timeB 
            : timeB - timeA;
        }
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
      case 'manual': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'auto': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'alert': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  }


getByDate() {
  this.isLoading = true;

  const isToday = this.isDateToday(this.dateFilter);

  const alerts$ = isToday ? this.apiService.getAlerts() : of([]); // Return empty array if not today
  const reboots$ = this.apiService.getRebootsByDate(this.dateFilter);

  forkJoin([alerts$, reboots$]).subscribe({
    next: ([alertsData, rebootsData]: [any[], any[]]) => {
      const combinedData = [...alertsData, ...rebootsData];
      this.alerts = combinedData;
      this.sites = [...new Set(combinedData.map(a => a.site))];
      this.applyFilters();
    },
    error: (err) => console.error('Fetch error:', err),
    complete: () => this.isLoading = false
  });
}

  onDateFilterChange() {
    this.getByDate();
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(destination: string) {
    this.isSidebarOpen = false;
    // Add navigation logic here
    switch(destination) {
      case 'technicians':
        // Navigate to technicians management
        this.router.navigate(['/techStats']);
        break;
      case 'machines':
        // Navigate to machines management
        this.router.navigate(['/machineStats']);
        break;
    }
  }

isDateToday(date: string | Date): boolean {
  const today = new Date();
  const input = new Date(date);
  return (
    input.getFullYear() === today.getFullYear() &&
    input.getMonth() === today.getMonth() &&
    input.getDate() === today.getDate()
  );
}
}
