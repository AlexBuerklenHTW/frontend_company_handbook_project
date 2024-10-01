import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ArticleDto} from "../../model/Article";
import {ArticleService} from "../../services/article.service";
import {NgIf, NgFor} from "@angular/common";
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDto | undefined;
  articleDto: ArticleDto[] = [];
  selectedVersion: number | undefined;
  errorMessage: string | null = null;
  articleLoaded: boolean = false;
  publicId: string = '';
  latestVersion: number | undefined;
  latestSubmittedArticle: ArticleDto | undefined;
  isAdmin: boolean = false;
  status: string = '';
  version: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.checkAdmin();
    this.publicId = this.route.snapshot.paramMap.get('id') || '';
    if (this.isAdmin) {
      this.loadLatestSubmittedArticle();
    }
    this.loadArticleVersionsForUserRole(this.publicId);
  }

  loadLatestSubmittedArticle(): void {
    this.articleService.getLatestSubmittedArticle(this.publicId).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading latest submitted article';
        this.articleLoaded = true;
        return of(undefined);
      })
    ).subscribe((article: ArticleDto | undefined) => {
      this.latestSubmittedArticle = article;
      this.articleLoaded = true;
    });
  }

  loadArticleVersionsForUserRole(publicId: string): void {
    const user = this.storageService.getUser();
    if (user) {
      this.articleService.getArticleVersionsByRole(publicId, user.role).pipe(
        catchError(error => {
          this.errorMessage = 'Error loading article versions';
          this.articleLoaded = true;
          return of([]);
        })
      ).subscribe((versionsOfArticleDto: ArticleDto[]) => {
        this.articleDto = versionsOfArticleDto.sort((a, b) => b.version! - a.version!);
        if (!this.isAdmin) {
          this.articleDto = this.articleDto.filter(version => version.status);
        }
        if (this.articleDto.length > 0) {
          this.latestVersion = this.articleDto[0].version;
          this.status = this.articleDto[0].status;
          if (!this.latestSubmittedArticle) {
            this.selectedVersion = this.latestVersion;
            this.article = this.articleDto[0];
          }
        }

        this.articleLoaded = true;
      });
    }
  }

  isArticleApproved(): boolean {
    return this.article?.status === "APPROVED";
  }

  onVersionChange(version: number): void {
    this.selectedVersion = version;
    this.article = this.articleDto.find(v => v.version === version);
  }

  approveArticle(status: string): void {
    const user = this.storageService.getUser();
    if (user) {
      const newVersion: number = this.latestVersion! + 1;
      this.articleService.approveArticle(this.publicId, status, newVersion , user?.username).subscribe((article) => {
        if (this.article) {
          this.article.status = article.status;
        }
      }, error => {
        this.errorMessage = 'Error approving article';
      });
    }
  }

  checkAdmin(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.isAdmin = user && user.role === 'ROLE_ADMIN';
    }
  }
}
