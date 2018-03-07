import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../config/config.service';

import { Project } from './project.component';

@Injectable()
export class ProjectService {
  private projectsUrl = this.config.apiUrl + 'api/projects/';

  constructor (
    private http: Http,
    private authHttp: AuthHttp,
    private config: ConfigService
    ) {}

  getProjects(): Observable<Project[]> {
    return this.authHttp.get(this.projectsUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getProject(id): Observable<Project> {
    return this.authHttp.get(this.projectsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  createProject(Project): Observable<Project> {
    return this.authHttp.post(this.projectsUrl, Project)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  deleteProject(id): Observable<Project> {
    return this.authHttp.delete(this.projectsUrl + id)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateProject(id, Project): Observable<Project> {
    return this.authHttp.put(this.projectsUrl + id, Project)
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
