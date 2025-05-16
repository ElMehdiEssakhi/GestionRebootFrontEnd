import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'login-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'rebootFront';
  user = '';
  password = '';
  isLoading = false;
  error= '';


  constructor(private auth: AuthService, private router: Router) {}
  
  handleSubmit() {
    this.isLoading = true;
    this.auth.login(this.user, this.password).subscribe({
      next: () => {
        const role = this.auth.getRole();
        this.isLoading = false;
        this.router.navigate([role === 'manager' ? '/manager' : '/technician']);
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.isLoading = false;
      }
    });
  }
}
