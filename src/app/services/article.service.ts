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

  getArticleByPublicId(publicId: string): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/article/${publicId}`);
  }

  // getArticleVersionsByRole(publicId: string, role: string): Observable<ArticleDto[]> {
  //   const params = new HttpParams().set('role', role);
  //   return this.http.get<ArticleDto[]>(`${this.apiUrl}/${publicId}/versions`, {params});
  // }

  getAllApprovedArticlesByPublicId(publicId: string): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/${publicId}/approvedArticlesByPublicId`)
  }

  getApprovedArticleByPublicIdAndLastVersion(publicId: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/approvedArticleByPublicIdAndLastVersion`);
  }

  updateArticle(publicId: string, username: string, articleDto: ArticleDto, version?: number, isEditable?: boolean): Observable<ArticleDto> {
    articleDto.editedBy = username;

    let params = new HttpParams();
    if (version !== undefined) {
      params = params.set('version', version.toString());
    }

    return this.http.put<ArticleDto>(`${this.apiUrl}/${publicId}/${isEditable}`, articleDto, { params });
  }


  setApprovalStatus(publicId: string, status: string, version: number, username: string): Observable<ArticleDto> {
    const approvalRequest: ApprovalRequestDto = {status: status, version: version, editedBy: username};
    return this.http.put<ArticleDto>(`${this.apiUrl}/${publicId}/approval`, approvalRequest);
  }

  getLatestArticleByPublicIdAndStatusAndEditedBy(publicId: string, editedBy: string): Observable<ArticleDto> {
    const params = new HttpParams()
      .set('editedBy', editedBy);
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/latest`, {params});
  }

  getArticleByPublicIdAndVersion(publicId: string, version: number, status: string): Observable<ArticleDto> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/version/${version}/${status}`);
  }

  // getLatestArticleByPublicIdAndLatestVersion(publicId: string): Observable<ArticleDto> {
  //   return this.http.get<ArticleDto>(`${this.apiUrl}/${publicId}/latestWithVersion`);
  // }

  getArticlesApproved(): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/approved`);
  }

  getArticlesEditedByUser(username: string): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.apiUrl}/user/${username}`);
  }
}
