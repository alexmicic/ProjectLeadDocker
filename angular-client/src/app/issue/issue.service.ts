import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../config/config.service';

import { Issue } from './issue.component';

@Injectable()
export class IssueService {
  private issuesUrl = this.config.apiUrl + 'api/issues/';
  private issuesForBoardUrl = this.config.apiUrl + 'api/boards/';
  private issuesForSprintUrl = this.config.apiUrl + 'api/sprints/';

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private config: ConfigService
    ) {}

  getIssues(): Observable<Issue[]> {
    return this.authHttp.get(this.issuesUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getIssuesForBoard(id): Observable<Issue[]> {
    return this.authHttp.get(this.issuesForBoardUrl + id + '/issues')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getIssuesForSprint(id): Observable<Issue[]> {
    return this.authHttp.get(this.issuesForSprintUrl + id + '/issues')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getIssue(id): Observable<Issue> {
    return this.authHttp.get(this.issuesUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  resetIssuesForBoard(id): Observable<any> {
    return this.authHttp.post(this.issuesForBoardUrl + id + '/reset', id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  assignIssuesToSprint(issueIds, sprintId): Observable<any> {
    return this.authHttp.post(this.issuesUrl + 'assign/' + sprintId, issueIds)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createIssue(Issue): Observable<Issue> {
    return this.authHttp.post(this.issuesUrl, Issue)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteIssue(id): Observable<Issue> {
    return this.authHttp.delete(this.issuesUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateIssue(id, Issue): Observable<Issue> {
    return this.authHttp.put(this.issuesUrl + id, Issue)
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
