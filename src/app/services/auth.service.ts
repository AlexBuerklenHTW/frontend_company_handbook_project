import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {StorageService} from "./storage.service";
import {User, UserCredentials} from "../model/User";
import {AuthStateService} from "./auth-state.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = 'http://localhost:8080/authenticate';
  registerUrl = 'http://localhost:8080/register';


  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient, private storageService: StorageService, private authStateService: AuthStateService) {
  }

  register(credentials: UserCredentials): Observable<User> {
    return this.http.post<User>(this.registerUrl, credentials, this.httpOptions);
  }

  login(username: string, password: string): Observable<string> {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      responseType: 'text' as 'json'  // <-- Hier wird 'text' als 'json' getarnt
    };
    return this.http.post<string>(this.authUrl, { username, password }, options).pipe(
      tap(token => {
        this.storageService.saveToken(token);
        const user = this.storageService.getUser();
        this.authStateService.setUser(user);
      })
    );
  }

  logout(): void {
    this.storageService.clean();
    this.authStateService.setUser(null);
  }
}
