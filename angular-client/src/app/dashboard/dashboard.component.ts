import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth.service';

import { ProjectService } from '../project/project.service';
import { Project } from '../project/project.component';
import { ProjectAddComponent } from '../project/project-add/project-add.component';

import { TeamService } from '../team/team.service';
import { Team } from '../team/team.component';
import { TeamAddComponent } from '../team/team-add/team-add.component';

import { Comment } from '../comment/comment.component';
import { CommentService } from '../comment/comment.service';

import { User } from '../user/user.component';
import { UserService } from '../user/user.service';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  id: string;
  errorMessage: string;
  projects: Project[] = [];
  teams: Team[];
  comments: Comment[];
  user: User;

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private projectService: ProjectService,
    private teamService: TeamService,
    private dialog: MatDialog,
    private commentService: CommentService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.id = this.auth.getUserId();
    this.titleService.setTitle('Dashboard');

    if (this.auth.isAdmin()) {
      this.getTeams();
      this.getComments();
      this.getProjects();
    } else {
      this.getUser();
    }
  }

  getProjects() {
    this.projectService.getProjects()
                        .subscribe(
                          projects => this.projects = projects,
                          error => this.errorMessage = <any>error);
  }

  getProjectsForUser() {
    this.user.teams.forEach(teamId => {
      this.teamService.getTeam(teamId)
                        .subscribe(
                          team => {
                            if ( team.project !== undefined ) {
                              this.projectService.getProject(team.project)
                                                    .subscribe(
                                                      project => this.projects.push(project),
                                                      error => this.errorMessage = <any>error);
                            }
                          },
                          error => this.errorMessage = <any>error);
    });
  }

  getUser() {
    this.userService.getUser(this.id)
                      .subscribe(
                        user => {
                          this.user = user;

                          this.getProjectsForUser();
                        },
                        error => this.errorMessage = <any>error);
  }

  deleteProject(id) {
    this.projectService.deleteProject(id)
                        .subscribe(
                          next => this.getProjects(),
                          error => this.errorMessage = <any>error);
  }

  addProject() {
    let dialogRef = this.dialog.open(ProjectAddComponent, {
      width: '600px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProjects();
    });
  }

  getTeams() {
    this.teamService.getTeams()
                        .subscribe(
                          teams => {
                            this.teams = teams;
                          },
                          error => this.errorMessage = <any>error);
  }

  deleteTeam(id) {
    this.teamService.deleteTeam(id)
                        .subscribe(
                          next => this.getTeams(),
                          error => this.errorMessage = <any>error);
  }

  addTeam() {
    let dialogRef = this.dialog.open(TeamAddComponent, {
      width: '600px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTeams();
    });
  }

  getComments() {
    this.commentService.getComments()
                        .subscribe(
                          comments => {
                            // take only last 5 comments and order them by dateCreated
                            this.comments = comments.sort( (a, b) => {
                              if (new Date(b.dateCreated) > new Date(a.dateCreated) ) {
                                return 1
                              }

                              return 0;
                            }).slice(0,6);
                          },
                          error => this.errorMessage = <any>error);
  }

}