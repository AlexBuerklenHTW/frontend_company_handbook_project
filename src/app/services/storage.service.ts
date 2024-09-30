import { Injectable } from '@angular/core';
import {jwtDecode } from "jwt-decode";
import {User} from "../model/User";
import {DecodedToken} from "../model/DecodedToken";


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private tokenKey = 'auth-token';

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
      return {
        username: decodedToken.sub,
        role: decodedToken.role || ''
      };
    }
    return null;
  }

  clean(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
