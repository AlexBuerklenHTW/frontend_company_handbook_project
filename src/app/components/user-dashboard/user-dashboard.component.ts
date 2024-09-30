import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {ArticleDto} from '../../model/Article';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {StorageService} from '../../services/storage.service';
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    RouterLink,
    MatCardSubtitle,
    NgClass,
    TitleCasePipe,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  articles: ArticleDto[] = [];
  filteredArticles: ArticleDto[] = [];
  articlesLoaded: boolean = false;
  errorMessage: string | null = null;
  filterForm: FormGroup | undefined;

  constructor(
    private articleService: ArticleService,
    private storageService: StorageService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      description: [''],
      sortOrder: ['asc']
    });

    this.filterForm.valueChanges.subscribe(values => {
      this.applyFilter(values);
    });

    this.loadArticles();
  }

  loadArticles(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.articleService.getArticlesEditedByUser(user.username).pipe(
        catchError(() => {
          this.errorMessage = 'Error loading articles. Please try again.';
          this.articlesLoaded = true;
          return of(null);
        })
      ).subscribe((data: ArticleDto[] | null) => {
        if (data !== null) {
          this.articles = data;
          this.applyDefaultSort();
          this.filteredArticles = this.articles;
          if (this.articles.length === 0) {
            this.errorMessage = 'No articles found.';
          }
        }
        this.articlesLoaded = true;
      });
    } else {
      this.errorMessage = 'User not found';
      this.articlesLoaded = true;
    }
  }


  applyDefaultSort(): void {
    this.articles.sort((a, b) => a.title.localeCompare(b.title));
  }

  applyFilter(values: any): void {
    this.filteredArticles = this.articles.filter(article => {
      const matchesTitle = values.title ? article.title.toLowerCase().includes(values.title.toLowerCase()) : true;
      const matchesDescription = values.description ? article.description.toLowerCase().includes(values.description.toLowerCase()) : true;

      return matchesTitle && matchesDescription;
    });

    if (values.sortOrder) {
      this.filteredArticles.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return values.sortOrder === 'asc' ? comparison : values.sortOrder === 'desc' ? -comparison : 0;
      });
    }
  }
}
