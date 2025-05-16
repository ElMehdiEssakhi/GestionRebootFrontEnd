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
  user: String = "";
  userSearchTerm: string = '';
  showUserDropdown: boolean = false;
  showUserSelection: boolean = false;
  filteredUsers: string[] = [];
  allTechs: string[] = []; // You'll populate this with your user list
  alerts: any[] = [];
  filteredAlerts: any[] = [];
  isLoading = false;
  searchTerm = '';
  sortField: string = 'machineName';
  sortDirection: 'asc' | 'desc' = 'asc';
  siteFilter = '';
  sites: string[] = [];
  showNotification = false;
  showUserWarning = false;
  selectedAlert: any = null;

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.sites = ["AGA","AHU","ESU","EUN","GLN","ERH","TTU","OUD","RAK","RBA","TNG","AGA","FEZ","CMN","VIL","OZZ","BEM","NDR"];
    this.apiService.getTechs().subscribe((data: any) => {
      this.allTechs = data.map((a: any) => a.name);
      this.filteredUsers = this.allTechs;
    });
  }
  toggleUserSelection(alert: any) {
    if (this.selectedAlert === alert && this.showUserSelection) {
      // Toggle off if same alert is clicked again
      this.showUserSelection = false;
      this.selectedAlert = null;
    } else {
      // Show dropdown for the selected alert
      this.selectedAlert = alert;
      this.showUserSelection = true;
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) {
      this.filterUsers();
    }
  }

  filterUsers() {
    if (!this.userSearchTerm) {
      this.filteredUsers = this.allTechs;
    } else {
      this.filteredUsers = this.allTechs.filter(user => 
        user.toLowerCase().includes(this.userSearchTerm.toLowerCase())
      );
    }
  }

  selectUser(selectedUser: string) {
    this.user = selectedUser;
    this.showUserDropdown = false;
    this.userSearchTerm = '';
    this.authService.setCurrentUser(selectedUser);
  }

  onSiteChange() {
    this.loadAlerts();
  }

  manualReboot(alert: any) {
    if(!this.user) {
      this.showUserWarning = true;
      setTimeout(() => {
        this.showUserWarning = false;
      }, 3000);
      return;
    }
    alert.isRemoving = true;
    this.apiService.markRebootAsManual(this.user, alert.id).subscribe({
      next: () => {
        this.showNotification = true;
        this.alerts = this.alerts.filter(a => a.id !== alert.id);
          this.applyFilters();
        setTimeout(() => {
          this.showNotification = false;
        }, 1000);
      },
      error: (err: Error) => {
        console.error('Error marking as manual reboot:', err);
        alert.isChecked = false;
        alert.isRemoving = false;
      }
    });
  }

  toggleSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.alerts;
    
    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(alert => 
        alert.machine.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let valueA, valueB;
      
      if (this.sortField === 'machineName') {
        valueA = a.machine.name.toLowerCase();
        valueB = b.machine.name.toLowerCase();
      } else if (this.sortField === 'postponedTime') {
        valueA = new Date(a.rebootPostponedAt).getTime();
        valueB = new Date(b.rebootPostponedAt).getTime();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredAlerts = filtered;
  }

  loadAlerts() {
    if (this.siteFilter) {
      this.isLoading = true;
      this.apiService.getPendingRebootsByZone(this.siteFilter).subscribe({
        next: (data: any[]) => {
          this.alerts = data;
          this.applyFilters();
        },
        error: (err) => console.error('Fetch error:', err),
        complete: () => this.isLoading = false
      });
    } else {
      this.alerts = [];
      this.filteredAlerts = [];
    }
  }
}
