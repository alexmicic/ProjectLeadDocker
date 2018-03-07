import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth.service';
import { BoardService } from '../board/board.service';
import { SprintService } from './sprint.service';
import { IssueService } from '../issue/issue.service';
import { Issue } from '../issue/issue.component';
import { DragulaService } from 'ng2-dragula';
import * as jQuery from 'jquery';
import { UserService } from '../user/user.service';

import { IssueComponent } from '../issue/issue.component';
import firebase from '../firebase.js';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarRef} from '@angular/material';

export class Sprint {
  id: string;
  name: string;
  dateStart: Date;
  dateEnd: Date;
  board: string;
  points: number;
  issueCount: number;
  isActive: boolean;
}

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit, OnDestroy {
  errorMessage: string;
  msg: string;
  columns: string[];
  issues: any[];
  issuesToUpdate: any[];
  dragula: any;
  boardId: string;
  projectId: string;
  sprint: Sprint[];
  daysLeft: any;
  initFirebase: boolean = false;
  sprintPoints: number = 0;

  constructor(
    private auth: Auth,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private sprintService: SprintService,
    private issueService: IssueService,
    private dragulaService: DragulaService,
    private userService: UserService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    this.dragula = dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
  }

  private onDrop(args) {
    let [e, el, container] = args;
    let id = jQuery(e).data('id');
    let status = jQuery(e).parents('.col').data('column');

    this.sprintPoints = 0;

    this.issueService.getIssue(id)
                      .subscribe(
                        issue => {
                          let issueObj = issue;
                          issueObj.status = status;
                          
                          this.issueService.updateIssue(id, issueObj)
                              .subscribe(
                                next => {
                                  firebase.database().ref('shouldSync').set( 
                                    {
                                      userId: this.auth.getUserId(),
                                      route: this.router.url,
                                      timestamp: Date.now()
                                    }
                                  );
                                },
                                error =>  this.errorMessage = <any>error);
                        },
                        error =>  this.errorMessage = <any>error); 
  }

  ngOnInit() {
    this.route.parent.params.subscribe( params => {
      this.boardId = params.id;
      this.getBoardColumns( this.boardId );
      //this.getActiveSprint( this.boardId );
    } );

    this.route.parent.parent.parent.params.subscribe( params => {
      this.projectId = params.id;
    } );

    firebase.database().ref('shouldSync').on('value', (snapshot) => {
      this.sprintPoints = 0;
      
      if ( snapshot.val() 
            && snapshot.val().userId !== this.auth.getUserId() 
            &&  snapshot.val().route === this.router.url
            && this.initFirebase ) {
        let snackBarRef = this.snackBar.open('Board is updated. Click here for a refresh.', 'REFRESH');
        snackBarRef.onAction().subscribe(() => {
          this.getActiveSprint( this.boardId );
        });
      } else {
        this.getActiveSprint( this.boardId );
      }

      this.initFirebase = true;
    }, (errorObject) => {
      // on error
      this.getActiveSprint( this.boardId );
      console.log("The read failed: " + errorObject.code);
    });
  }

  ngOnDestroy () {
    this.dragula.unsubscribe();
    this.snackBar.dismiss();
    firebase.database().ref('shouldSync').off();
  }

  getBoardColumns(boardId) {
    this.boardService.getBoard(boardId)
                      .subscribe(
                              board => {
                                this.columns = board.columns;
                              },
                              error =>  this.errorMessage = <any>error);
  }

  getActiveSprint(boardId) {
    this.sprintService.getActiveSprintForBoard(boardId)
                        .subscribe(
                              sprint => {
                                if( sprint && sprint.length > 0 ) {
                                  this.getIssuesForSprint(sprint);
                                  this.sprint = sprint;
                                  this.calcRemainingDays(sprint);
                                } else {
                                  this.sprint = null;
                                  this.issues = null;
                                }
                              },
                              error =>  this.errorMessage = <any>error);
  }

  getIssuesForSprint(sprint) {
    this.issueService.getIssuesForSprint(sprint[0]._id)
                      .subscribe(
                              issues => {
                                this.issues = issues;

                                this.issues.forEach((issue, index) => {
                                  this.getUser(index, issue.assignee);

                                  this.sprintPoints += issue.points;
                                });
                              },
                              error =>  this.errorMessage = <any>error);
  }

  closeSprint(sprintId) {
    // reset all issues to OPEN status
    this.issueService.getIssuesForSprint(sprintId)
                      .subscribe(
                              issues => {
                                this.issuesToUpdate = issues.filter(issue => issue.status !== 'DONE');
                                
                                this.issuesToUpdate.forEach((issue, index) => {
                                  issue.status = 'OPEN';
                                  this.issueService.updateIssue(issue._id, issue)
                                                      .subscribe(
                                                        next => {},
                                                        error => this.errorMessage = <any>error);
                                });
                              },
                              error =>  this.errorMessage = <any>error);
    
    // set sprint to isActive false
    this.sprintService.getSprint(sprintId)
                        .subscribe(
                          sprint => {
                            sprint.isActive = false;
                            this.sprintService.updateSprint(sprintId, sprint)
                                                .subscribe(
                                                  next => {
                                                    this.getActiveSprint( this.boardId );
                                                  },
                                                  error => this.errorMessage = <any>error);
                          },
                          error => this.errorMessage = <any>error);
  }

  getUser(index, userId) {
    this.userService.getUser(userId)
                        .subscribe(
                          user => {
                            this.issues[index].assignee = user.firstName + ' ' + user.lastName;
                          },
                          error => this.errorMessage = <any>error);
  }

  viewIssue(issueId) {
    let dialogRef = this.dialog.open(IssueComponent, {
      width: '600px',
      height: '100%',
      data: { issueId: issueId, projectId: this.projectId, referrer: 'SprintComponent' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( result && result.referrer === 'SprintComponent' && result.flag ) {
        firebase.database().ref('shouldSync').set( 
          {
            userId: this.auth.getUserId(),
            route: this.router.url,
            timestamp: Date.now()
          }
        );
      }
    });
  }

  calcRemainingDays(sprint) {
    let end = new Date(sprint[0].dateEnd);
    let now = new Date();
    let timeDiff = end.getTime() - now.getTime();
    let daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    this.daysLeft = daysLeft > 0 ? daysLeft : 0;
  }

}
