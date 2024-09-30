import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {StorageService} from "../../services/storage.service";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {Router, RouterLink} from '@angular/router';
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {AuthStateService} from "../../services/auth-state.service";
import {User} from "../../model/User";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    MatIcon,
    NgIf,
    MatToolbar,
    MatAnchor,
    RouterLink,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatMenuTrigger
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router, private authStateService: AuthStateService) {
  }

  ngOnInit(): void {
    this.authStateService.user$.subscribe((user: User | null) => {
      if (user) {
        this.username = user.username;
        this.isAdmin = user.role === 'ROLE_ADMIN';
      } else {
        this.username = null;
        this.isAdmin = false;
      }
    });

    const user = this.storageService.getUser();
    if (user) {
      this.authStateService.setUser(user);
    }
  }

  logout(): void {
    this.authService.logout()
    this.username = null;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}

