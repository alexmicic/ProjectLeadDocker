import { Component, OnInit, Inject } from '@angular/core';
import { IssueService } from './issue.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import { User } from '../user/user.component';
import { SprintService } from '../sprint/sprint.service';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/comment.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import firebase from '../firebase.js';

export class Issue {
  id: string;
  name: string;
  desc: string;
  priority: string;
  status: string;
  date: Date;
  points: number;
  assignee: string;
  board: string;
  user: string;
  sprints: [string];
}

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
  errorMessage: string;
  msg: string;
  issue: Issue;
  usersGroups: any = [];
  sprintToPullIn: any;
  comments: Comment[];
  comment: Comment;

  constructor(
    private issueService: IssueService,
    private auth: Auth,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<IssueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private teamService: TeamService,
    private sprintService: SprintService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.getIssue();
    if ( this.auth.isAdmin() ) {
      this.getUsers();
    }

    this.getCommentsForIssue();

    this.comment = new Comment;
  }

  getIssue() {
    this.issueService.getIssue(this.data.issueId)
                    .subscribe(
                      issue => this.issue = issue,
                      error =>  this.errorMessage = <any>error);
  }

  close(flag) {
    let obj = {
      referrer: this.data.referrer,
      flag: flag || false
    }
    this.dialogRef.close(obj);
  }

  save() {
    this.issueService.updateIssue(this.data.issueId, this.issue)
                    .subscribe(
                      next => {
                        this.close(true);
                      },
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

  delete() {
    this.issueService.deleteIssue(this.data.issueId)
                    .subscribe(
                      next => {
                        firebase.database().ref('shouldSync').set( 
                          {
                            userId: this.auth.getUserId(),
                            route: this.router.url,
                            timestamp: Date.now()
                          }
                        );
                        this.close(true);
                      },
                      error =>  this.errorMessage = <any>error);
  }

  pullToActiveSprint(issue, boardId) {
    this.sprintService.getActiveSprintForBoard(boardId)
                        .subscribe(
                          sprint => {
                            this.sprintToPullIn = sprint[0];
                            let issueIdsObj = {
                              issueIds: [issue._id]
                            };
                            this.issueService.assignIssuesToSprint(issueIdsObj, this.sprintToPullIn._id)
                                    .subscribe(
                                      next => this.close(true),
                                      error =>  this.errorMessage = <any>error);
                          },
                          error =>  this.errorMessage = <any>error);
  }

  getCommentsForIssue() {
    this.commentService.getCommentsForIssue(this.data.issueId)
                          .subscribe(
                            comments => this.comments = comments,
                            error =>  this.errorMessage = <any>error);
  }

  addComment() {
    this.comment.user = this.auth.getUserId();
    this.comment.issue = this.data.issueId;
    this.comment.userFullName = this.auth.getUserFullName();

    this.commentService.createComment(this.comment)
                          .subscribe(
                            next => {
                              this.getCommentsForIssue()
                              this.comment = new Comment;
                            },
                            error =>  this.errorMessage = <any>error);
  }

}
