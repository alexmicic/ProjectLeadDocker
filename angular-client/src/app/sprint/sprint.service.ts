import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../config/config.service';

import { Sprint } from './sprint.component';

@Injectable()
export class SprintService {
  private sprintsUrl = this.config.apiUrl + 'api/sprints/';
  private SprintsForBoardUrl = this.config.apiUrl + 'api/boards/';

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private config: ConfigService
    ) {}

  getSprints(): Observable<Sprint[]> {
    return this.authHttp.get(this.sprintsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getSprintsForBoard(id): Observable<Sprint[]> {
    return this.authHttp.get(this.SprintsForBoardUrl + id + '/sprints')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getActiveSprintForBoard(id): Observable<Sprint[]> {
    return this.authHttp.get(this.SprintsForBoardUrl + id + '/sprints/active')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getSprint(id): Observable<Sprint> {
    return this.authHttp.get(this.sprintsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createSprint(Sprint): Observable<Sprint> {
    return this.authHttp.post(this.sprintsUrl, Sprint)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteSprint(id): Observable<Sprint> {
    return this.authHttp.delete(this.sprintsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateSprint(id, Sprint): Observable<Sprint> {
    return this.authHttp.put(this.sprintsUrl + id, Sprint)
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
