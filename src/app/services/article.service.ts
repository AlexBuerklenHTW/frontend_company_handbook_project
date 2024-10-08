import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleDto} from "../model/Article";

interface ApprovalRequestDto {
  status: string;
  version: number;
  editedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/articles';

  constructor(private http: HttpClient) {
  }

  createArticle(username: string, articleDto: ArticleDto): Observable<ArticleDto> {
    articleDto.editedBy = username;
    return this.http.post<ArticleDto>(`${this.apiUrl}`, articleDto);
  }

  getAllArticles(): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}`);
  }

  getArticleVersionsByRole(publicId: string, role: string): Observable<ArticleDto[]> {
    const params = new HttpParams().set('role', role);
    console.log(params);
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/${publicId}/versions`, {params});
  }

  getLatestSubmittedArticle(publicId: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/latest-submitted`);
  }

  updateArticle(id: string, username: string, articleDto: ArticleDto): Observable<ArticleDto> {
    articleDto.editedBy = username;
    return this.http.put<ArticleDto>(`${this.apiUrl}/${id}`, articleDto);
  }

  approveArticle(publicId: string, status: string, version: number, username: string): Observable<ArticleDto> {
    const approvalRequest: ApprovalRequestDto = {status: status, version: version, editedBy: username};
    console.log(approvalRequest);
    return this.http.put<ArticleDto>(`${this.apiUrl}/${publicId}/approval`, approvalRequest);
  }

  getLatestArticleByPublicIdAndStatusAndEditedBy(publicId: string, editedBy: string): Observable<ArticleDto> {
    const params = new HttpParams()
      .set('editedBy', editedBy);
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/latest`, {params});
  }

  getLatestArticleByPublicIdAndStatus(publicId: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/latestWithVersion`);
  }

  getArticlesApproved(): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/approved`);
  }

  getArticlesEditedByUser(username: string): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/user/${username}`);
  }

}
