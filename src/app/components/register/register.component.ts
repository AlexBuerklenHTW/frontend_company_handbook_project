import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FormsModule } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserCredentials } from "../../model/User";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: UserCredentials = {
    username: "",
    password: "",
    confirmPassword: ""
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.loading = true;

    if (this.form.password !== this.form.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      this.isSignUpFailed = true;
      this.loading = false;
      return;
    }

    this.authService.register(this.form).subscribe(
      () => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.loading = false;
        this.router.navigate(['/login']);
      },
      err => {
        this.errorMessage = err.error.message || "An error occurred during registration. Please try again later.";
        this.isSignUpFailed = true;
        this.loading = false;
      }
    );
  }
}
