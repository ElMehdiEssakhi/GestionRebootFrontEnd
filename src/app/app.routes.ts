import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TechDashboardComponent } from './tech-dashboard/tech-dashboard.component';
import { MachineStatsComponent } from './machine-stats/machine-stats.component';
import { TechStatsComponent } from './tech-stats/tech-stats.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'manager', component: ManagerDashboardComponent },
    { path: 'technician', component: TechDashboardComponent },
    { path: 'techStats', component: TechStatsComponent },
    { path: 'machineStats', component: MachineStatsComponent },
    { path: '**', redirectTo: 'login' } // fallback for unknown routes
];
