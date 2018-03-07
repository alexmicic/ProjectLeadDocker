import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth.service';

// angular material
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  msg: string = '';
  user: {} = {
    email: '',
    password: ''
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private auth: Auth,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if ( this.auth.loggedIn() ) {
      this.router.navigate(['dashboard']);
    }
  }

  login() {
    this.loginService.login(this.user)
                    .subscribe(
                      data => {
                        if (data.success) {
                          localStorage.setItem('token', data.token);
                          localStorage.setItem('isAdmin', data.admin);
                          localStorage.setItem('userId', data.id);
                          localStorage.setItem('userFullName', data.firstName + ' ' + data.lastName);
                          this.router.navigate(['dashboard']);
                          this.snackBar.dismiss();
                        } else {
                          this.msg = 'Something went wrong, please check your input data and try again.';
                          this.snackBar.open(this.msg);
                        }
                      },
                      error =>  this.errorMessage = <any>error);
  }

}
