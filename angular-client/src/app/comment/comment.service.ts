import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../config/config.service';

import { Comment } from './comment.component';

@Injectable()
export class CommentService {
  private commmentsUrl = this.config.apiUrl + 'api/comments/';
  private commentsForIssue = this.config.apiUrl + 'api/issues/';

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private config: ConfigService
    ) {}

  getComments(): Observable<Comment[]> {
    return this.authHttp.get(this.commmentsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getCommentsForIssue(id): Observable<Comment[]> {
    return this.authHttp.get(this.commentsForIssue + id + '/comments')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getComment(id): Observable<Comment> {
    return this.authHttp.get(this.commmentsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createComment(Comment): Observable<Comment> {
    return this.authHttp.post(this.commmentsUrl, Comment)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteComment(id): Observable<Comment> {
    return this.authHttp.delete(this.commmentsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateComment(id, Comment): Observable<Comment> {
    return this.authHttp.put(this.commmentsUrl + id, Comment)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
