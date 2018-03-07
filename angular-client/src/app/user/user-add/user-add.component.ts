import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../user.component';
import { Team } from '../../team/team.component';
import { TeamService } from '../../team/team.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  errorMessage: string;
  msg: string;
  user: User;
  users: User[];
  teams: Team[];
  selectedUser: string;

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.user = new User;

    if ( this.data.pull ) {
      this.getUsers();
      this.users = [];
    } else {
      this.user.teams = [''];
      this.getTeams();
    }
  }
  
  close() {
    this.dialogRef.close();
  }

  save() {
    this.userService.createUser(this.user)
                    .subscribe(
                      data => this.validate(data),
                      error =>  this.errorMessage = <any>error);
  }

  getUsers() {
    this.userService.getUsers()
                    .subscribe(
                      users => {
                        for (let i = 0; i < users.length; i++) {
                          if ( users[i].teams.indexOf( this.data.teamId ) < 0 ) {
                            this.users.push(users[i]);
                          }
                        }
                      },
                      error =>  this.errorMessage = <any>error);
  }

  getTeams() {
    this.teamService.getTeams()
                    .subscribe(
                      teams => this.teams = teams,
                      error =>  this.errorMessage = <any>error);
  }

  pullSave() {
     this.userService.getUser(this.selectedUser)
                    .subscribe(
                      user => {
                        this.user = user;

                        if ( user.teams.indexOf( this.data.teamId ) < 0 ) {
                          this.user.teams.push(this.data.teamId);

                          this.userService.updateUser(this.selectedUser, this.user)
                                          .subscribe(
                                            data => this.validate(data),
                                            error =>  this.errorMessage = <any>error);
                        }
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
