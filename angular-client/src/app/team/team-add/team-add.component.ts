import { Component, OnInit, Inject } from '@angular/core';
import { TeamService } from '../team.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Team } from '../team.component';
import { Project } from '../../project/project.component';
import { ProjectService } from '../../project/project.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-team-add',
  templateUrl: './team-add.component.html',
  styleUrls: ['./team-add.component.css']
})
export class TeamAddComponent implements OnInit {
  errorMessage: string;
  msg: string;
  team: Team;
  projects: Project[];

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<TeamAddComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.team = new Team;
    this.getProjects();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.teamService.createTeam(this.team)
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

  getProjects() {
    this.projectService.getProjects()
                        .subscribe(
                          projects => {
                            this.projects = projects;
                          },
                          error => this.errorMessage = <any>error);
  }

}
