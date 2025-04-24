import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LogOut, UserCircle, LucideAngularModule, RefreshCw } from 'lucide-angular';
import { AuthService } from '../services/auth.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, LucideAngularModule]
})
export class NavbarComponent {
  user: String = "";
  isMobileMenuOpen = false;
  isMenuOpen = false;
  LogOut = LogOut;
  UserCircle = UserCircle;
  RefreshCw = RefreshCw;
 
  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUserNAme();
  }
  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
