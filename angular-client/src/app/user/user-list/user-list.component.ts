import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth.service';

import { UserService } from '../user.service';
import { User } from '../user.component';
import { UserAddComponent } from '../user-add/user-add.component';

// angular material
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  id: string;
  errorMessage: string;
  users: User[];

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private userService: UserService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.parent.parent.params.subscribe( params => {
      this.id = params.id;
      this.getUsersForTeam(this.id);
    } );
  }

  getUsersForTeam(id) {
    this.userService.getUsersForTeam(id)
                        .subscribe(
                          users => {
                            this.users = users;
                          },
                          error => this.errorMessage = <any>error);
  }

  deleteUser(id) {
    this.userService.deleteUser(id)
                        .subscribe(
                          next => this.getUsersForTeam(this.id),
                          error => this.errorMessage = <any>error);
  }

  addUser() {
    let dialogRef = this.dialog.open(UserAddComponent, {
      width: '600px',
      data: { teamId: this.id, pull: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsersForTeam(this.id);
    });
  }

  pullUser() {
    let dialogRef = this.dialog.open(UserAddComponent, {
      width: '600px',
      data: { teamId: this.id, pull: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsersForTeam(this.id);
    });
  }

}
