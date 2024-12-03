import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleDto} from "../model/Article";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/articles';

  constructor(private http: HttpClient) {
  }

  createArticle(username: string | undefined, articleDto: ArticleDto): Observable<ArticleDto> {
    articleDto.editedBy = username;
    return this.http.post<ArticleDto>(`${this.apiUrl}`, articleDto);
  }

  setSubmitStatus(username: string | undefined, articleDto: ArticleDto): Observable<ArticleDto> {
    articleDto.editedBy = username;
    return this.http.post<ArticleDto>(`${this.apiUrl}/submitting`, articleDto);
  }

  getListOfArticlesByStatusSubmitted(): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}`);
  }

  getSubmittedArticleByPublicId(publicId: string, status: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/${status}/submittedArticleByPublicId`);
  }

  getAllApprovedArticlesByPublicId(publicId: string, status: string): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/${publicId}/approvedArticlesByPublicId/${status}`)
  }

  getApprovedArticleByPublicIdAndLastVersion(publicId: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/approvedArticleByPublicIdAndLastVersion`);
  }

  updateArticle(publicId: string, articleDto: ArticleDto | undefined, editedBy?: string, version?: number, isEditable?: boolean): Observable<ArticleDto> {
    if (articleDto) {
      articleDto.editedBy = editedBy;
    }

    let params = new HttpParams();
    if (version !== undefined) {
      params = params.set('version', version.toString());
    }

    return this.http.post<ArticleDto>(`${this.apiUrl}/${publicId}/${isEditable}`, articleDto, { params });
  }

  setApprovalStatus(publicId: string, articleDto: ArticleDto | undefined): Observable<ArticleDto> {
    return this.http.post<ArticleDto>(`${this.apiUrl}/approval/${publicId}`, articleDto);
  }

  getArticleByPublicIdAndVersion(publicId: string, version: number, status: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/version/${version}/${status}`);
  }

  declineArticle(publicId: string, status: string) {
    return this.http.post<ArticleDto>(`${this.apiUrl}/decline/${publicId}/${status}`, {});
  }

  getArticlesApproved(): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/approved`);
  }

  getArticlesEditedByUser(username: string): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/user/${username}`);
  }
}
