import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../config/config.service';

import { Board } from './board.component';

@Injectable()
export class BoardService {
  private boardsUrl = this.config.apiUrl + 'api/boards/';
  private boardsForProjectUrl = this.config.apiUrl + 'api/projects/';

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private config: ConfigService
    ) {}

  getBoards(): Observable<Board[]> {
    return this.authHttp.get(this.boardsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getBoardsForProject(id): Observable<Board[]> {
    return this.authHttp.get(this.boardsForProjectUrl + id + '/boards')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getBoard(id): Observable<Board> {
    return this.authHttp.get(this.boardsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createBoard(Board): Observable<Board> {
    return this.authHttp.post(this.boardsUrl, Board)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteBoard(id): Observable<Board> {
    return this.authHttp.delete(this.boardsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateBoard(id, Board): Observable<Board> {
    return this.authHttp.put(this.boardsUrl + id, Board)
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
