import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {RouterOutlet} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {NavbarComponent} from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-auth-app';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    //this.authService.loadCurrentUser();
  }
}
