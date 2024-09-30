import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { DialogService } from "./dialogservice.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private storageService: StorageService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.storageService.getUser();

    if (!user) {
      this.dialogService.showError('You need to log in to access this page.');
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = next.data['role'];
    if (requiredRole && user.role !== requiredRole) {
      this.dialogService.showError('You are not authorized to access this page');
      this.router.navigate(['/articles']);
      return false;
    }

    return true;
  }
}
