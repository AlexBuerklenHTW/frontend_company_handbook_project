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
  publicId!: string;
  editedBy: string | undefined;
  version: number | undefined;
  errorMessage: string | null = null;
  articleLoaded: boolean = false;
  status!: string;
  private initialFormValue!: Partial<ArticleDto>;
  isEditable: boolean = false;
  isSubmitted: boolean = false;

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
    this.version = Number(this.route.snapshot.params['selectedVersion']);
    this.status = this.route.snapshot.params['status'];
    this.loadLatestArticle(this.publicId, this.version, this.status);
  }

  loadLatestArticle(publicId: string, version: number, status: string): void {
    const user = this.storageService.getUser();
    if (user) {
      this.articleService.getArticleByPublicIdAndVersion(publicId, version, status).pipe(
        catchError(() => {
          this.errorMessage = 'ID of Article not found';
          this.articleLoaded = true;
          return of(null);
        })
      ).subscribe((data) => {
        if (data) {
          this.editedBy = data.editedBy;
          this.isSubmitted = data.isSubmitted;
          this.articleForm.patchValue(data);
          this.initialFormValue = {...this.articleForm.value};
        } else {
          this.errorMessage = 'ID of Article not found';
        }
        this.articleLoaded = true;
      });
    }
  }
  //
  // loadLatestEditedArticle(): void {
  //   const user = this.storageService.getUser();
  //   if (user) {
  //     this.articleService.getLatestArticleByPublicIdAndStatusAndEditedBy(this.publicId, user.username).pipe(
  //       catchError(error => {
  //         this.errorMessage = 'ID of Article not found';
  //         this.articleLoaded = true;
  //         return of(null);
  //       })
  //     ).subscribe((data: ArticleDto | null) => {
  //       console.log(data)
  //       if (data) {
  //         this.articleForm.patchValue(data);
  //         this.initialFormValue = {...this.articleForm.value};
  //       } else {
  //         this.errorMessage = 'ID of Article not found';
  //       }
  //       this.articleLoaded = true;
  //     });
  //   }
  // }

  hasFormChanged(): boolean {
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(this.articleForm.value);
  }

  // saving Article
  onSubmit(): void {
    const user = this.storageService.getUser();
    if (user && this.articleForm.valid) {

      this.editedBy = user.username;

      const updatedArticle: ArticleDto = {...this.articleForm.value, publicId: this.publicId, status: this.status, isEditable: false, editedBy: this.editedBy, version: this.version, isSubmitted: this.isSubmitted};
      this.articleService.updateArticle(this.publicId, updatedArticle, this.editedBy, this.version, false).subscribe(() => {
        this.router.navigate(['/user-dashboard']);
      });
    }
  }

  // Submitting Article
  onSubmitArticle(): void {
    const user = this.storageService.getUser();


    if (user && this.articleForm.valid) {
      this.editedBy = user.username;

      const updatedArticle: ArticleDto = {...this.articleForm.value, publicId: this.publicId, status: 'SUBMITTED', editedBy: this.editedBy, version: this.version, isSubmitted: this.isSubmitted};
      this.articleService.setSubmitStatus(updatedArticle.editedBy, updatedArticle).subscribe(() => {
        this.router.navigate(['/articles']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/articles', this.publicId]);
  }
}
