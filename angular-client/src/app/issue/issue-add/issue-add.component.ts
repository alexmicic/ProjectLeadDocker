import { Component, OnInit, Inject } from '@angular/core';
import { IssueService } from '../issue.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Issue } from '../issue.component';
import { Auth } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { TeamService } from '../../team/team.service';
import { User } from '../../user/user.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-issue-add',
  templateUrl: './issue-add.component.html',
  styleUrls: ['./issue-add.component.css']
})
export class IssueAddComponent implements OnInit {
  errorMessage: string;
  msg: string;
  issue: Issue;
  usersGroups: any = [];

  constructor(
    private issueService: IssueService,
    private auth: Auth,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<IssueAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.issue = new Issue;
    this.issue.board = this.data.boardId;
    this.issue.user = this.auth.getUserId();
    this.issue.assignee = this.auth.getUserId();

    if ( this.auth.isAdmin() ) {
      this.getUsers();
    }
  }
  
  close() {
    this.dialogRef.close();
  }

  save() {
    this.issueService.createIssue(this.issue)
                    .subscribe(
                      data => this.validate(data),
                      error =>  this.errorMessage = <any>error);
  }
  
  getUsers() {
    this.teamService.getTeamsForProject(this.data.projectId)
                    .subscribe(
                      teams => {
                        teams.forEach(team => {
                          let teamEl = <any>team;
                          this.userService.getUsersForTeam(teamEl._id)
                                          .subscribe(
                                            users => {
                                              let group = {
                                                users: users,
                                                label: team.name
                                              };
                                              this.usersGroups.push(group);
                                            },
                                            error =>  this.errorMessage = <any>error);
                        });                  
                      },
                      error =>  this.errorMessage = <any>error);
  }

  validate(data) {
    if (!data.success) {
      this.msg = data.message;
    } else {
      this.close();
    }
  }

}
