import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ArticleService} from "../../services/article.service";
import {ArticleDto} from "../../model/Article";
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {NgIf} from "@angular/common";
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatError} from '@angular/material/form-field';
import {EditorComponent} from "@tinymce/tinymce-angular";
import {StorageService} from "../../services/storage.service";
import {ArticleDetailComponent} from "../article-detail/article-detail.component";

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatError,
    EditorComponent
  ]
})
export class ArticleEditComponent implements OnInit {
  articleForm: FormGroup;
  publicId!: string; // Anpassung hier, um publicId zu verwenden
  errorMessage: string | null = null;
  articleLoaded: boolean = false;
  private initialFormValue!: Partial<ArticleDto>;
  status!: string;

  init: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min'
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required],
      publicId: ['']
    });
  }

  ngOnInit(): void {
    this.publicId = this.route.snapshot.params['id'];
    this.status = this.route.snapshot.params['status'];
    console.log(this.status);
    if (this.status === 'APPROVED') {
      this.loadLatestArticle();
    }else{
      this.loadLatestEditedArticle();
    }
  }

  loadLatestArticle(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.articleService.getLatestArticleByPublicIdAndStatus(this.publicId).pipe(
        catchError(error => {
          this.errorMessage = 'ID of Article not found';
          this.articleLoaded = true;
          return of(null);
        })
      ).subscribe((data: ArticleDto | null) => {
        if (data) {
          console.log(data);
          this.articleForm.patchValue(data);
          this.initialFormValue = {...this.articleForm.value};
          console.log(this.initialFormValue);
        } else {
          this.errorMessage = 'ID of Article not found';
        }
        this.articleLoaded = true;
      });
    }
  }

  loadLatestEditedArticle(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.articleService.getLatestArticleByPublicIdAndStatusAndEditedBy(this.publicId, user.username).pipe(
        catchError(error => {
          this.errorMessage = 'ID of Article not found';
          this.articleLoaded = true;
          return of(null);
        })
      ).subscribe((data: ArticleDto | null) => {
        if (data) {
          console.log(data);
          this.articleForm.patchValue(data);
          this.initialFormValue = {...this.articleForm.value};
          console.log(this.initialFormValue);
        } else {
          this.errorMessage = 'ID of Article not found';
        }
        this.articleLoaded = true;
      });
    }
  }

  hasFormChanged(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.articleForm.value);
  }

  onSubmit(): void {
    const user = this.storageService.getUser();
    if (user && this.articleForm.valid) {

      const updatedArticle: ArticleDto = {...this.articleForm.value, publicId: this.publicId, status: "EDITING"}; // Ensure publicId is included
      console.log(updatedArticle);
      this.articleService.updateArticle(this.publicId, user.username, updatedArticle).subscribe(() => {
        this.router.navigate(['/user-dashboard']);
      });
    }
  }

  onSubmitArticle(): void {
    const user = this.storageService.getUser();

    if (user && this.articleForm.valid) {
      const updatedArticle: ArticleDto = {...this.articleForm.value, publicId: this.publicId, status: 'SUBMITTED'}; // Ensure status is set to SUBMITTED
      this.articleService.updateArticle(this.publicId, user.username, updatedArticle).subscribe(() => {
        this.router.navigate(['/articles']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/articles', this.publicId]);
  }
}
