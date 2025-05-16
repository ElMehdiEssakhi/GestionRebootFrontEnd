import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogOut, UserCircle, LucideAngularModule, RefreshCw } from 'lucide-angular';
import { AuthService } from '../services/auth.service';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, LucideAngularModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: String = "";
  isMobileMenuOpen = false;
  isMenuOpen = false;
  LogOut = LogOut;
  UserCircle = UserCircle;
  RefreshCw = RefreshCw;
  private userSubscription: Subscription = new Subscription();
 
  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getCurrentUser() || this.authService.getRole();
  }

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user || this.authService.getRole();
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  navigateToMainPage() {
    if (this.user === 'manager') {
      this.router.navigate(['/manager']);
    } else {
      this.router.navigate(['/technician']);
    }
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
