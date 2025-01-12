import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {ArticleService} from '../../services/article.service';
import {ArticleDto} from '../../model/ArticleDto';
import {MatCard, MatCardContent} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {EditorComponent, TINYMCE_SCRIPT_SRC} from "@tinymce/tinymce-angular";
import {MatButton} from "@angular/material/button";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  standalone: true,
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ],
  imports: [
    MatCard,
    MatError,
    MatCardContent,
    NgIf,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    EditorComponent,
    MatButton
  ],
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent {
  articleForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const user = this.storageService.getUser();

    if (user && this.articleForm.valid) {
      const newArticle: ArticleDto = this.articleForm.value;
      this.articleService.createArticle(user.username, newArticle).pipe(
        catchError(err => {
          this.errorMessage = 'Error submitting form';
          return of(null);
        })
      ).subscribe((response) => {
        if (response) {
          this.router.navigate(['/articles']);
        }
      });
    } else {
      this.errorMessage = 'All fields are required';
    }
  }

  init: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min'
  };

  onCancel(): void {
    this.router.navigate(['/articles']);
  }
}
