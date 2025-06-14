import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { Technician } from '../models/technician';

@Component({
  selector: 'app-tech-stats',
  templateUrl: './tech-stats.component.html',
  styleUrls: ['./tech-stats.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule, NavbarComponent]
})
export class TechStatsComponent implements OnInit, OnDestroy {
  private charts: Chart[] = [];
  topTechnicians: Technician[] = [];
  filteredTechs: Technician[] = [];
  isLoading: boolean = true;
  totalReboots: number = 0;
  activeTechs: number = 0;
  newTechName = '';
  selectedSite = '';
  sites = ["AGA","AHU","ESU","EUN","GLN","ERH","TTU","OUD","RAK","RBA","TNG","AGA","FEZ","CMN","VIL","OZZ","BEM","NDR"]; // This will be replaced with actual sites from API
  isAddingTech = false;
  showTechSuccessMessage = false;
  showTechErrorMessage = false;
  techErrorMessage = '';
  searchTerm = '';
  filterSite = '';
  showDeleteFor: number | null = null;
  deleteTechSuccessMessage: boolean = false;

  constructor(
    private apiService: ApiService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadTopTechnicians();
  }

  ngOnDestroy() {
    this.charts.forEach(chart => chart.destroy());
  }

  private loadTopTechnicians() {
    this.isLoading = true;
    this.apiService.getTechs().subscribe((data: any) => {
      // Calculate total reboots and count active techs
      this.totalReboots = data.reduce((sum: number, tech: any) => sum + tech.rebootCount, 0);
      this.activeTechs = data.length; // Each tech in the data is considered active
      
      // Then map and sort the technicians
      this.topTechnicians = data
        .map((a: any) => ({
          id: a.id,
          name: a.name,
          rebootCount: a.rebootCount,
          site: a.site
        }))
        .sort((a: Technician, b: Technician) => b.rebootCount - a.rebootCount);
      this.isLoading = false;
      this.filteredTechs=this.topTechnicians;
    });
  }

  addTechnician() {
    if (!this.newTechName.trim() || !this.selectedSite) return;
    
    this.isAddingTech = true;
    this.showTechSuccessMessage = false;
    this.showTechErrorMessage = false;
    
    this.apiService.addTechnician(this.newTechName,this.selectedSite).subscribe({
      next: () => {
        this.isAddingTech = false;
        this.showTechSuccessMessage = true;
        this.newTechName = '';
        this.selectedSite = '';
        setTimeout(() => {
          this.showTechSuccessMessage = false;
        }, 2000);
      },
      error: (err: Error) => {
        console.error('Error adding technician:', err);
        this.isAddingTech = false;
        this.showTechErrorMessage = true;
        this.techErrorMessage = (err as any).error?.message || 'Failed to add technician. Please try again.';
        setTimeout(() => {
          this.showTechErrorMessage = false;
        }, 2000);
      }
    });
  }

  showDeleteOption(tech: Technician) {
    this.showDeleteFor = tech.id;
  }

  deleteTechnician(tech: Technician) {
    this.apiService.deleteTech(tech).subscribe({
      next: () => {
        this.topTechnicians = this.topTechnicians.filter(t => t.id !== tech.id);
        this.activeTechs--;
        this.totalReboots = this.topTechnicians.reduce((sum, t) => sum + t.rebootCount, 0);
        this.showDeleteFor = null;
        this.deleteTechSuccessMessage = true;
        this.filteredTechs = this.topTechnicians;
        setTimeout(() => {
          this.deleteTechSuccessMessage = false;
        }, 2000);
      },
      error: (err: Error) => {
        console.error('Error deleting technician:', err);
        this.showTechErrorMessage = true;
        this.techErrorMessage = (err as any).error?.message || 'Failed to delete technician. Please try again.';
        setTimeout(() => {
          this.showTechErrorMessage = false;
        }, 2000);
      }
    });
  }
  filterMachines() {
    let filtered = [...this.topTechnicians];
    
    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Filter by site
    if (this.filterSite) {
      filtered = filtered.filter(tech =>
        tech.site === this.filterSite
      );
    }
    
    this.filteredTechs = filtered;
  }
}
