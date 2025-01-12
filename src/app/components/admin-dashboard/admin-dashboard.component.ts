import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ArticleService} from "../../services/article.service";
import {ArticleDto} from "../../model/ArticleDto";
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";

interface GroupedArticle {
  article: ArticleDto;
  versions: ArticleDto[];
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgForOf,
    RouterLink,
    NgClass,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class AdminDashboardComponent implements OnInit {
  articles: ArticleDto[] = [];
  groupedArticles: GroupedArticle[] = [];
  filteredGroupedArticles: GroupedArticle[] = [];
  articlesLoaded: boolean = false;
  errorMessage: string | null = null;
  filterForm: FormGroup | undefined;

  constructor(
    private articleService: ArticleService,
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
    this.articleService.getListOfArticlesByStatusSubmitted().pipe(
      catchError(() => {
        this.errorMessage = 'Error loading articles. Please try again later.';
        this.articlesLoaded = true;
        return of(null);
      })
    ).subscribe((data: ArticleDto[] | null) => {
      if (data) {
        this.articles = data;
        this.groupArticles();
        this.applyDefaultSort();
        this.filteredGroupedArticles = this.groupedArticles;
      } else {
        this.errorMessage = 'No articles found.';
      }
      this.articlesLoaded = true;
    });
  }

  applyDefaultSort(): void {
    this.groupedArticles.sort((a, b) => a.article.title.localeCompare(b.article.title));
  }

  groupArticles(): void {
    const articleMap = new Map<string, ArticleDto[]>();
    this.articles.forEach(article => {
      if (!articleMap.has(article.publicId!)) {
        articleMap.set(article.publicId!, []);
      }
      articleMap.get(article.publicId!)!.push(article);
    });

    this.groupedArticles = Array.from(articleMap.values()).map(versions => {
      const sortedVersions = versions.sort((a, b) => b.version! - a.version!);
      return {
        article: sortedVersions[0],
        versions: sortedVersions
      };
    });
  }

  applyFilter(values: any): void {
    this.filteredGroupedArticles = this.groupedArticles.filter(articleGroup => {
      const {article} = articleGroup;
      const matchesTitle = values.title ? article.title.toLowerCase().includes(values.title.toLowerCase()) : true;
      const matchesDescription = values.description ? article.description.toLowerCase().includes(values.description.toLowerCase()) : true;

      return matchesTitle && matchesDescription;
    });

    if (values.sortOrder) {
      this.filteredGroupedArticles.sort((a, b) => {
        const comparison = a.article.title.localeCompare(b.article.title);
        return values.sortOrder === 'asc' ? comparison : values.sortOrder === 'desc' ? -comparison : 0;
      });
    }
  }
}
