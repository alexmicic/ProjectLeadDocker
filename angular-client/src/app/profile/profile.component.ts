import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../user/user.component';
import { Auth } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  errorMessage: string;
  user: User;
  id: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) { }

  ngOnInit() {
    this.id = this.auth.getUserId();
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.id)
                    .subscribe(
                      user => this.user = user,
                      error =>  this.errorMessage = <any>error);
  }

  back() {
    this.router.navigate(['/dashboard/'])
  }

  save() {
    this.userService.updateUser(this.id, this.user)
                    .subscribe(
                      next => this.back(),
                      error =>  this.errorMessage = <any>error);
  }

}
