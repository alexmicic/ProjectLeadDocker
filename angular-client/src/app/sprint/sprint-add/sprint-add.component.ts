import { Component, OnInit, Inject } from '@angular/core';
import { IssueService } from '../../issue/issue.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth.service';
import { SprintService } from '../sprint.service';
import { Sprint } from '../sprint.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-sprint-add',
  templateUrl: './sprint-add.component.html',
  styleUrls: ['./sprint-add.component.css']
})
export class SprintAddComponent implements OnInit {
  errorMessage: string;
  msg: string;
  sprint: Sprint;

  constructor(
    private issueService: IssueService,
    private auth: Auth,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<SprintAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sprintService: SprintService
  ) { }

  ngOnInit() {
    this.sprint = new Sprint;
    this.sprint.isActive = true;
    this.sprint.board = this.data.boardId;
  }
  
  close(flag) {
    this.dialogRef.close( flag || false );
  }

  save() {
    this.sprintService.createSprint(this.sprint)
                    .subscribe(
                      data => this.getActiveSprint(),
                      error =>  this.errorMessage = <any>error);
  }

  getActiveSprint() {
    this.sprintService.getActiveSprintForBoard(this.data.boardId)
                      .subscribe(
                              data => this.updateIssues(data),
                              error =>  this.errorMessage = <any>error);
  }

  updateIssues(data) {
    if (data.length && data.length < 0) {
      this.msg = data.message;
    } else {
      // update every issue that is added to the sprint
      let issueIdsObj = {
        issueIds: this.data.issues
      };
      this.issueService.assignIssuesToSprint(issueIdsObj, data[0]._id)
                        .subscribe(
                          next => this.close(true),
                          error =>  this.errorMessage = <any>error);
    }
  }

}
