import { Injectable } from '@angular/core';
import {User} from "../model/User";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() { }

  setUser(user: User | null): void {
    this.userSubject.next(user);
  }
}
