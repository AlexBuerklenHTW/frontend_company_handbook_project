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
  articles: ArticleDto[] = [];  // Artikel werden hier gespeichert
  selectedVersion: number | undefined;
  errorMessage: string | null = null;
  articleLoaded: boolean = false;
  publicId: string = '';
  latestVersion: number | undefined;
  latestSubmittedArticle: ArticleDto | undefined;
  isAdmin: boolean = false;
  status: string = '';
  version: number = 0;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.publicId = this.route.snapshot.paramMap.get('id') || '';
    this.loadApprovedArticleByPublicIdAndLastVersion(this.publicId);
    this.loadAllApprovedArticlesByPublicIdForVersions(this.publicId);
  }

  loadApprovedArticleByPublicIdAndLastVersion(publicId: string): void {
    this.articleService.getApprovedArticleByPublicIdAndLastVersion(publicId).pipe(
      catchError(() => {
        this.errorMessage = 'Error loading latest approved article';
        this.articleLoaded = true;
        return of(undefined);
      })
    ).subscribe((article: ArticleDto | undefined) => {
      if (article) {
        this.article = article;
        this.latestVersion = article.version;
        this.selectedVersion = article.version;
        this.status = article.status;
        console.log('detailpage status: ', this.status)
      } else {
        this.errorMessage = 'No approved article found';
      }
      this.articleLoaded = true;
    });
  }


  loadAllApprovedArticlesByPublicIdForVersions(publicId: string): void {
    this.articleService.getAllApprovedArticlesByPublicId(publicId).subscribe((articles: ArticleDto[]) => {
        this.articles = articles;
      }
    )
  }

  isArticleApproved(): boolean {
    return this.article?.status === "APPROVED";
  }

  onVersionChange(version: number): void {
    this.selectedVersion = version;
    this.article = this.articles.find(v => v.version === version);
  }

  approveArticle(status: string): void {
    const user = this.storageService.getUser();
    if (user) {
      const newVersion: number = this.latestVersion! + 1;
      this.articleService.setApprovalStatus(this.publicId, status, newVersion, user?.username).subscribe((article) => {
        if (this.article) {
          this.article.status = article.status;
        }
      }, () => {
        this.errorMessage = 'Error approving article';
      });
    }
  }

  // need for admin
  checkAdmin(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.isAdmin = user && user.role === 'ROLE_ADMIN';
    }
  }
}
