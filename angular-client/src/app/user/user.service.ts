import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../config/config.service';

import { User } from './user.component';

@Injectable()
export class UserService {
  private usersUrl = this.config.apiUrl + 'api/users/';
  private usersForTeamUrl = this.config.apiUrl + 'api/teams/';

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private config: ConfigService
    ) {}

  getUsers(): Observable<User[]> {
    return this.authHttp.get(this.usersUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getUsersForTeam(id): Observable<User[]> {
    return this.authHttp.get(this.usersForTeamUrl + id + '/users')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getUser(id): Observable<User> {
    return this.authHttp.get(this.usersUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createUser(User): Observable<User> {
    return this.authHttp.post(this.usersUrl, User)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteUser(id): Observable<User> {
    return this.authHttp.delete(this.usersUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateUser(id, User): Observable<User> {
    return this.authHttp.put(this.usersUrl + id, User)
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
