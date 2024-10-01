import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StorageService } from "../../services/storage.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: { username: string, password: string } = {
    username: "",
    password: ""
  };
  isLoginFailed = false;
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(
      (token: string) => {
        this.storageService.saveToken(token);
        this.router.navigate(['/articles']);
        this.loading = false;
      },
      (err: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(err);
        this.isLoginFailed = true;
        this.loading = false;
      }
    );
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Invalid login credentials';
    }
    return 'An unexpected error occurred. Please try again later.';
  }
}
