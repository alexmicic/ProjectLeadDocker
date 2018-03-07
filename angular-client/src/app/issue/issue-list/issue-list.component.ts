import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth.service';

import { IssueService } from '../issue.service';
import { Issue } from '../issue.component';
import { IssueAddComponent } from '../issue-add/issue-add.component';
import { IssueComponent } from '../issue.component';

import { UserService } from '../../user/user.service';

import { SprintAddComponent } from '../../sprint/sprint-add/sprint-add.component';
import { SprintService } from '../../sprint/sprint.service';

// angular material
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarRef} from '@angular/material';

import firebase from '../../firebase.js';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit, OnDestroy {
  id: string;
  errorMessage: string;
  issues: Issue[];
  projectId: string;
  issuesForSprint: Issue[];
  issuesDone: Issue[];
  initFirebase: boolean = false;
  activeSprint: any;

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private issueService: IssueService,
    private dialog: MatDialog,
    private userService: UserService,
    public snackBar: MatSnackBar,
    public sprintService: SprintService
  ) { }

  ngOnInit() {
    this.issuesForSprint = [];

    this.route.parent.params.subscribe( params => {
      this.id = params.id;
      this.getActiveSprint();
      //this.getIssuesForBoard(this.id);
    });

    this.route.parent.parent.parent.params.subscribe( params => {
      this.projectId = params.id;
    });

    firebase.database().ref('shouldSync').on('value', (snapshot) => {
      if ( snapshot.val() 
            && snapshot.val().userId !== this.auth.getUserId() 
            &&  snapshot.val().route === this.router.url
            && this.initFirebase ) {
        let snackBarRef = this.snackBar.open('Issue list is updated. Click here for a refresh.', 'REFRESH');
        snackBarRef.onAction().subscribe(() => {
          this.getIssuesForBoard(this.id);
        });
      } else {
        this.getIssuesForBoard(this.id);
      }

      this.initFirebase = true;
    }, (errorObject) => {
      // on error
      this.getIssuesForBoard(this.id);
      console.log("The read failed: " + errorObject.code);
    });
  }

  ngOnDestroy() {
    firebase.database().ref('shouldSync').off();
  }

  getIssuesForBoard(id) {
    this.issueService.getIssuesForBoard(id)
                        .subscribe(
                          issues => {
                            this.issues = issues.filter(
                              issue => issue.status !== 'DONE'
                            );

                            // sort issues per active sprint
                            if ( this.activeSprint ) {
                              this.issues = this.issues.sort(
                                issue => {
                                  if ( issue.sprints.indexOf(this.activeSprint._id) !== -1) {
                                    return 0;
                                  } else {
                                    return 1;
                                  }
                                }
                              );
                            }

                            this.issuesDone = issues.filter(
                              issue => issue.status === 'DONE'
                            );
                          },
                          error => this.errorMessage = <any>error);
  }

  addIssue() {
    let dialogRef = this.dialog.open(IssueAddComponent, {
      width: '600px',
      height: '100%',
      data: { boardId: this.id, projectId: this.projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.getIssuesForBoard(this.id);
      firebase.database().ref('shouldSync').set( 
        {
          userId: this.auth.getUserId(),
          route: this.router.url,
          timestamp: Date.now()
        }
      );
      this.issuesForSprint = [];
    });
  }

  viewIssue(issue, issueId) {
    let dialogRef = this.dialog.open(IssueComponent, {
      width: '600px',
      height: '100%',
      data: { issueId: issueId, projectId: this.projectId, referrer: 'IssueListComponent', isInSprint: this.activeSprint ? (issue.sprints.indexOf(this.activeSprint._id) !== -1) : true }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.getIssuesForBoard(this.id);

      if ( result && result.referrer === 'IssueListComponent' && result.flag ) {
        firebase.database().ref('shouldSync').set( 
          {
            userId: this.auth.getUserId(),
            route: this.router.url,
            timestamp: Date.now()
          }
        );
        this.issuesForSprint = [];
      }
    });
  }

  // getUser(id) {
  //   this.userService.getUser(id)
  //                       .subscribe(
  //                         user => {
  //                           return user.firstName + ' ' + user.lastName;
  //                         },
  //                         error => this.errorMessage = <any>error);
  // }

  toggleSprintIssues(event, id) {
    if ( event.checked ) {
      this.issuesForSprint.push(id);
    } else {
      let index = this.issuesForSprint.indexOf(id);
      this.issuesForSprint.splice(index, 1);
    }

    // console.log(this.issuesForSprint);
  }

  startSprint() {
    let dialogRef = this.dialog.open(SprintAddComponent, {
      width: '600px',
      data: { issues: this.issuesForSprint, boardId: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( result ) {
        this.router.navigate(['./sprint'], {relativeTo:this.route});
        this.issuesForSprint = [];
      }
    });
    
  }

  getActiveSprint() {
    this.sprintService.getActiveSprintForBoard(this.id)
                        .subscribe(
                              sprint => this.activeSprint = sprint[0],
                              error =>  this.errorMessage = <any>error);
  }

}
