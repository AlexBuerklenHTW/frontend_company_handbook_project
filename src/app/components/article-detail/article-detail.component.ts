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
  articles: ArticleDto[] = [];
  selectedVersion: number | undefined;
  errorMessage: string | null = null;
  articleLoaded: boolean = false;
  publicId: string = '';
  latestVersion: number | undefined = 0;
  latestSubmittedArticle: ArticleDto | undefined;
  isAdmin: boolean = false;
  status: string = '';
  version: number = 0;
  isUser: null | boolean = false;
  isSubmitted: boolean = false;
  versionStatusMap = new Map<number, string>();

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.checkRole()
    this.publicId = this.route.snapshot.paramMap.get('id') || 'no id transferred';
    this.status = this.route.snapshot.paramMap.get('status') || 'no status transferred';
    if (this.status === 'APPROVED') {
      this.loadApprovedArticleByPublicIdAndLastVersion(this.publicId);
      this.loadAllApprovedArticlesByPublicIdForVersions(this.publicId);
    }
    if (this.status === 'SUBMITTED') {
      this.loadSubmittedArticleByPublicIdAndStatus(this.publicId, this.status)
    }
  }

  // load details of article, when approved
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
      } else {
        this.errorMessage = 'No approved article found';
      }
      this.articleLoaded = true;
    });
    if (this.article?.status === 'SUBMITTED') {
      this.isSubmitted = true;
    }
  }

  // for the drop-down menü
  loadAllApprovedArticlesByPublicIdForVersions(publicId: string): void {
    this.articleService.getAllApprovedArticlesByPublicId(publicId).subscribe((articles: ArticleDto[]) => {
        this.articles = articles;

        articles.forEach(article => {
          if (article.version != null) {
            this.versionStatusMap.set(article.version, article.status);
          }
        });
      }
    )
  }

  loadSubmittedArticleByPublicIdAndStatus(publicId: string, status: string): void {
    this.articleService.getSubmittedArticleByPublicId(publicId, status).pipe(
      catchError(() => {
        this.errorMessage = 'Error loading submitted article';
        this.articleLoaded = true;
        return of(undefined);
      })
    ).subscribe((article: ArticleDto | undefined) => {
      if (article) {
        this.article = article;
        this.latestVersion = article.version;
        this.selectedVersion = article.version;
      } else {
        this.errorMessage = 'No submitted article found';
      }
      this.isSubmitted = true;
      this.articleLoaded = true;
    });
  }


  isArticleApproved(): boolean {
    return this.article?.status === "APPROVED";
  }

  onVersionChange(version: number): void {
    this.selectedVersion = version;
    this.article = this.articles.find(v => v.version === version);
  }

  //TODO: Deny Funktionalität umsetzten
  denyArticle(): void {
  }

  get versionStatusArray(): { version: number; status: string }[] {
    return Array.from(this.versionStatusMap.entries()).map(([version, status]) => ({ version, status }));
  }

  approveArticle(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.articleService.setApprovalStatus(this.publicId, this.article).subscribe((article) => {
        if (this.article) {
          this.article.status = article.status;
        }
      }, () => {
        this.errorMessage = 'Error approving article';
      });
    }
  }

  checkRole(): void {
    const user = this.storageService.getUser();
    if (user?.role === 'ROLE_ADMIN') {
      this.isAdmin = user && user.role === 'ROLE_ADMIN';
    } else {
      this.isUser = user && user.role === 'ROLE_USER'
    }
  }
}
