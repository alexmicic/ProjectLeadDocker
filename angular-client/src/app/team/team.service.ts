import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../config/config.service';

import { Team } from './team.component';

@Injectable()
export class TeamService {
  private teamsUrl = this.config.apiUrl + 'api/teams/';
  private projecsUrl = this.config.apiUrl + 'api/projects/'

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private config: ConfigService
    ) {}

  getTeams(): Observable<Team[]> {
    return this.authHttp.get(this.teamsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getTeamsForProject(id): Observable<Team[]> {
    return this.authHttp.get(this.projecsUrl + id + '/teams')
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getTeam(id): Observable<Team> {
    return this.authHttp.get(this.teamsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createTeam(Team): Observable<Team> {
    return this.authHttp.post(this.teamsUrl, Team)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteTeam(id): Observable<Team> {
    return this.authHttp.delete(this.teamsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateTeam(id, Team): Observable<Team> {
    return this.authHttp.put(this.teamsUrl + id, Team)
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
