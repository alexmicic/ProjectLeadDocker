import { Component, OnInit, Inject } from '@angular/core';
import { ProjectService } from '../project.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Project } from '../project.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  errorMessage: string;
  msg: string;
  project: Project;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<ProjectAddComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.project = new Project;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.projectService.createProject(this.project)
                    .subscribe(
                      data => this.validate(data),
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
