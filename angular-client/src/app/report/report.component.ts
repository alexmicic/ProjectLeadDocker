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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  id: string;
  errorMessage: string;
  issues: any = {};
  projectId: string;
  sprints: any[];
  totalPoints: number = 0;
  projectStart: Date;
  projectCurrent: Date;
  daysTotal: number = 0;
  totalIssues: number = 0;
  totalIssuesDone: number = 0;
  totalIssuesNotDone: number = 0;
  activeSprint: any;

  // chart points per sprint
  // lineChart
  public lineChartData:Array<any> = [];
  public lineChartLabels:Array<any> = [];
  public lineChartType:string = 'bar';

  // chart points per sprint
  // pie
  public pieChartLabels:string[] = ['Resolved issues', 'Pending issues'];
  public pieChartData:number[] = [];
  public pieChartType:string = 'bar';

  // chart brake down status per sprint
  // pie
  public pieChartLabelsBrake:string[] = [];
  public pieChartDataBrake:number[] = [];
  public pieChartTypeBrake:string = 'bar';

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
      this.getIssuesForBoard(this.id);
      this.getActiveSprint(this.id);
    });

    this.route.parent.parent.parent.params.subscribe( params => {
      this.projectId = params.id;
    });
  }

  getSprintsForBoard(id) {
    this.sprintService.getSprintsForBoard(id)
                        .subscribe(
                          sprints => {

                            if ( sprints && sprints.length > 0 ) {
                              this.sprints = sprints.filter(
                                sprint => !sprint.isActive
                              );

                              if ( this.sprints.length > 0 ) {
                                this.projectCurrent = this.sprints[this.sprints.length - 1].dateEnd;

                                this.sprints.forEach((sprint, index) => {
                                  if ( index === 0 ) {
                                    this.projectStart = sprint.dateStart;
                                  }
                                  this.getIssuesForSprint(sprint._id, index);
                                  this.calculateProjectLength();

                                  this.lineChartLabels.push(sprint.name);
                                });
                              }
                            }
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
                            
                            // add to graph
                            this.lineChartData.push(total);

                            // total points for sprints
                            this.totalPoints += total;
                          },
                          error => this.errorMessage = <any>error);
  }

  getIssuesForBoard(id) {
    this.issueService.getIssuesForBoard(id)
                        .subscribe(
                          issues => {

                            if ( issues && issues.length > 0 ) {
                              this.totalIssues = issues.length;

                              this.totalIssuesDone = issues.filter(
                                issue => issue.status === 'DONE'
                              ).length;

                              this.pieChartData.push(this.totalIssuesDone);

                              this.totalIssuesNotDone = issues.filter(
                                issue => issue.status !== 'DONE'
                              ).length;

                              this.pieChartData.push(this.totalIssuesNotDone);
                            }
                          },
                          error => this.errorMessage = <any>error);
  }

  getActiveSprint(id) {
    this.sprintService.getActiveSprintForBoard(id)
                        .subscribe(
                          sprint => {
                            if( sprint && sprint.length > 0 ) {
                              this.activeSprint = sprint;
                              this.getIssuesForActiveSprint(sprint);
                            }
                          },
                          error => this.errorMessage = <any>error);
  }

  getIssuesForActiveSprint(sprint) {
    this.issueService.getIssuesForSprint(sprint[0]._id)
                      .subscribe(
                        issues => {
                          if( issues && issues.length > 0 ) {
                            // totals obj
                            let issueTotals = {};

                            // iterrate trough issues and add labels and sum up totals
                            issues.forEach((issue, index) => {
                              if ( this.pieChartLabelsBrake.indexOf(issue.status) === -1 ) {
                                this.pieChartLabelsBrake.push(issue.status);
                              }

                              if ( issueTotals[issue.status] ) {
                                issueTotals[issue.status] += 1;
                              } else {
                                issueTotals[issue.status] = 1;
                              }
                            });

                            // iterate over totals and add them to chart data array
                            for ( let key in issueTotals ) {
                              this.pieChartDataBrake.push(issueTotals[key]);
                            }
                          }
                        },
                        error =>  this.errorMessage = <any>error);
  }

  calculateProjectLength () {
    let temp = new Date(this.projectCurrent);
    let now = new Date();
    let end = now > temp ? temp : now;
    let start = new Date(this.projectStart);

    let timeDiff = Math.abs(end.getTime() - start.getTime());
    let daysTotal = Math.ceil(timeDiff / (1000 * 3600 * 24));

    this.daysTotal = daysTotal;
  }

  chartClicked(e:any):void {
    console.log(e);
  }
 
  chartHovered(e:any):void {
    console.log(e);
  }

  chartOpen() {
    this.lineChartType = 'line';
    this.pieChartType = 'pie';
    this.pieChartTypeBrake = 'pie';
  }

}
