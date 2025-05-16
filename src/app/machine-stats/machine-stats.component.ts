import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { Machine } from '../models/machine';
import { forkJoin } from 'rxjs';
import { ZoneStats } from '../models/ZoneStats';
import { Alert } from '../models/alerts.model';

@Component({
  selector: 'app-machine-stats',
  templateUrl: './machine-stats.component.html',
  styleUrls: ['./machine-stats.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent]
})
export class MachineStatsComponent implements OnInit, OnDestroy {
  machines: Machine[] = [];
  filteredMachines: Machine[] = [];
  totalMachines = 0;
  totalAutoReboots = 0;
  totalManualReboots = 0;
  autoZonesStats: ZoneStats[] = [];
  manualZonesStats: ZoneStats[] = [];
  alerts: Alert[] = [];
  searchTerm = '';
  sortField = '';
  sortDirection = 'asc';
  showAutoChart = true;
  showManualChart = false;
  showAlerts = false;
  newMachine = "";
  private chart: Chart | null = null;
  isAddingMachine: boolean= false;
  showSuccessMessage: boolean= false;
  showErrorMessage: boolean= false;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadMachineData();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private loadMachineData() {
    this.apiService.getMachines().subscribe((data: any) => {
      this.machines = data;
      this.filteredMachines = [...data];
      this.totalMachines = data.length;
      this.getTotalAutoReboots();
      this.getTotalManualReboots();
      this.getZonesStats();
    });
  }

  private getTotalAutoReboots(){
    this.apiService.getTotalAutoReboots().subscribe((data: any) => {
      this.totalAutoReboots = data;
    });
  }

  private getTotalManualReboots(){
    this.apiService.getTotalManualReboots().subscribe((data: any) => {
      this.totalManualReboots = data;
    });
  }

  private getZonesStats(): void {
    forkJoin({
      autoReboots: this.apiService.getTotalAutoRebootsBySites(),
      manualReboots: this.apiService.getTotalManualRebootsBySites(),
      alerts: this.apiService.getTotalAlertsBySites()
    }).subscribe({
      next: ({ autoReboots, manualReboots,alerts }) => {
        this.autoZonesStats = autoReboots;
        this.manualZonesStats = manualReboots;
        this.alerts= alerts;
        this.initZoneDistributionChart();
      },
      error: (error) => {
        console.error('Error loading zone stats:', error);
      }
    });
  }

  private initZoneDistributionChart() {
    if (!this.autoZonesStats.length || !this.manualZonesStats.length||!this.alerts.length) return;

    const ctx = document.getElementById('zoneDistributionChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy();
    }
    
    const stats = 
  this.showAutoChart ? this.autoZonesStats :
  this.showManualChart ? this.manualZonesStats : 
  this.alerts;

    const label = this.showAutoChart ? 'Auto Reboots' : this.showManualChart ? 'Manual Reboots': 'Alerts';
    
    // 17 distinct colors with different opacities for auto/manual
const colors = [
  { bg: 'rgba(0, 0, 255, 1)', border: 'rgb(0, 0, 255)' },         // Blue
  { bg: 'rgba(0, 128, 0, 1)', border: 'rgb(0, 128, 0)' },         // Green
  { bg: 'rgba(255, 0, 0, 1)', border: 'rgb(255, 0, 0)' },         // Red
  { bg: 'rgba(255, 165, 0, 1)', border: 'rgb(255, 165, 0)' },     // Orange
  { bg: 'rgba(128, 0, 128, 1)', border: 'rgb(128, 0, 128)' },     // Purple
  { bg: 'rgba(0, 206, 209, 1)', border: 'rgb(0, 206, 209)' },     // Cyan
  { bg: 'rgba(255, 192, 203, 1)', border: 'rgb(255, 192, 203)' }, // Pink
  { bg: 'rgba(139, 69, 19, 1)', border: 'rgb(139, 69, 19)' },     // Brown
  { bg: 'rgba(128, 128, 0, 1)', border: 'rgb(128, 128, 0)' },     // Olive
  { bg: 'rgba(0, 128, 128, 1)', border: 'rgb(0, 128, 128)' },     // Teal
  { bg: 'rgba(128, 128, 128, 1)', border: 'rgb(128, 128, 128)' }, // Gray
  { bg: 'rgba(255, 255, 0, 1)', border: 'rgb(255, 255, 0)' },     // Yellow
  { bg: 'rgba(0, 0, 128, 1)', border: 'rgb(0, 0, 128)' },         // Navy
  { bg: 'rgba(255, 105, 180, 1)', border: 'rgb(255, 105, 180)' }, // Hot Pink
  { bg: 'rgba(220, 20, 60, 1)', border: 'rgb(220, 20, 60)' },     // Crimson
  { bg: 'rgba(34, 139, 34, 1)', border: 'rgb(34, 139, 34)' },     // Forest Green
  { bg: 'rgba(70, 130, 180, 1)', border: 'rgb(70, 130, 180)' }    // Steel Blue
];




    const backgroundColor = colors.map(color => 
      this.showAutoChart ? color.bg : color.bg.replace('1', '0.8')
    );
    const borderColor = colors.map(color => color.border);
    
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: stats.map(data => 'zone' in data ? data.zone : data.site),
        datasets: [{
          label: label,
          data: stats.map(data => 'reboots' in data ? data.reboots : data.alerts),
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false
          }
        }
      }
    });
  }

  toggleChart() {
    this.initZoneDistributionChart();
  }

  filterMachines() {
    if (!this.searchTerm) {
      this.filteredMachines = [...this.machines];
    } else {
      this.filteredMachines = this.machines.filter(machine =>
        machine.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.sortMachines();
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortMachines();
  }

  private sortMachines() {
  if (!this.sortField) return;

  this.filteredMachines.sort((a, b) => {
    let aValue: number;
    let bValue: number;
    if (this.sortField === 'totalReboots') {
      aValue = (a.taskSchedulerReboots || 0) + (a.techReboots || 0);
      bValue = (b.taskSchedulerReboots || 0) + (b.techReboots || 0);
    } else {
      aValue = typeof a[this.sortField as keyof Machine] === 'number' ? a[this.sortField as keyof Machine] as number : 0;
      bValue = typeof b[this.sortField as keyof Machine] === 'number' ? b[this.sortField as keyof Machine] as number : 0;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    console.log('not sorting')
    return 0;
  });
}
  addMachine() {
    if (!this.newMachine.trim()) return;
    this.isAddingMachine = true;
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
    this.apiService.addMachine(this.newMachine).subscribe({
      next: () => {
        this.isAddingMachine = false;
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.newMachine = '';
        }, 2000);
      },
      error: (err: Error) => {
        console.error('Error adding machine:', err);
        this.isAddingMachine = false;
        this.showErrorMessage = true;
        this.showErrorMessage = (err as any).error?.message || 'Failed to add machine. Please try again.';
      }

  })
}

}
