import { Component } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-denytext',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './deny-text.component.html',
  styleUrls: ['./deny-text.component.css']
})
export class DenyTextComponent {
  denyTextForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DenyTextComponent>
  ) {
    this.denyTextForm = this.fb.group({
      denyText: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.denyTextForm.valid) {
      this.dialogRef.close(this.denyTextForm.value.denyText);
    }
  }
}
