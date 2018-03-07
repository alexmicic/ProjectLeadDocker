import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth.service';

import { IssueService } from '../issue/issue.service';
import { Issue } from '../issue/issue.component';
import { IssueComponent } from '../issue/issue.component';

import { UserService } from '../user/user.service';

import { SprintService } from '../sprint/sprint.service';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  id: string;
  errorMessage: string;
  issues: any = {};
  projectId: string;
  sprints: any[];

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private issueService: IssueService,
    private userService: UserService,
    public sprintService: SprintService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe( params => {
      this.id = params.id;
      this.getSprintsForBoard(this.id);
    });

    this.route.parent.parent.parent.params.subscribe( params => {
      this.projectId = params.id;
    });
  }

  getSprintsForBoard(id) {
    this.sprintService.getSprintsForBoard(id)
                        .subscribe(
                          sprints => {
                            this.sprints = sprints.filter(
                              sprint => !sprint.isActive
                            );

                            this.sprints.forEach((sprint, index) => {
                              this.getIssuesForSprint(sprint._id, index);
                            });
                          },
                          error => this.errorMessage = <any>error);
  }

  getIssuesForSprint(id, index) {
    this.issueService.getIssuesForSprint(id)
                        .subscribe(
                          issues => {
                            let issuesForSprint = issues.filter(
                              issue => issue.status === 'DONE' && issue.sprints.indexOf(id) === issue.sprints.length - 1
                            );

                            // create object of arrays
                            this.issues[id] = issuesForSprint;

                            // calculate total points
                            let total = 0;
                            issuesForSprint.forEach((issue, index) => {
                              total += issue.points;
                            });

                            this.sprints[index].totalPoints = total;
                          },
                          error => this.errorMessage = <any>error);
  }

  viewIssue(issueId) {
    let dialogRef = this.dialog.open(IssueComponent, {
      width: '600px',
      data: { issueId: issueId, projectId: this.projectId, referrer: 'HistoryComponent' }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.getIssuesForBoard(this.id);
    });
  }

}
