import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ArticleService } from "../../services/article.service";
import { ArticleDto } from "../../model/Article";
import { RouterLink } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatList, MatListItem } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgForOf,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatList,
    MatListItem,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class ArticleListComponent implements OnInit {
  articles: ArticleDto[] = [];
  filteredArticles: ArticleDto[] = [];
  articlesLoaded: boolean = false;
  errorMessage: string | null = null;
  filterForm: FormGroup | undefined;

  constructor(private articleService: ArticleService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      description: [''],
      content: [''],
      sortOrder: ['asc']
    });

    this.filterForm.valueChanges.subscribe(values => {
      this.applyFilter(values);
    });

    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getArticlesApproved().subscribe(
      (data: ArticleDto[]) => {
        try {
          this.articles = this.getLatestVersions(data);
          this.filteredArticles = this.articles;
        } catch (error) {
          this.errorMessage = (error as Error).message;
        }
        this.articlesLoaded = true;
      },
      () => {
        this.errorMessage = 'Error loading articles. Please try again later.';
        this.articlesLoaded = true;
      }
    );
  }

  getLatestVersions(articles: ArticleDto[]): ArticleDto[] {
    if (!articles || articles.length === 0) {
      throw new Error('No articles found.');
    }

    const articleMap = new Map<string, ArticleDto>();

    articles.forEach(article => {
      const existingArticle = articleMap.get(article.publicId!);
      if (!existingArticle || (article.version! > existingArticle.version!)) {
        articleMap.set(article.publicId!, article);
      }
    });

    return Array.from(articleMap.values());
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
