import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ErrorDialogComponent} from "../components/error-dialog/error-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  showError(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message }
    });
  }
}
