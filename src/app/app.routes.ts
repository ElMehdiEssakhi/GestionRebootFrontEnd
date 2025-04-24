import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TechDashboardComponent } from './tech-dashboard/tech-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'manager', component: ManagerDashboardComponent },
    { path: 'technician', component: TechDashboardComponent },
    { path: '**', redirectTo: 'login' } // fallback for unknown routes
];
