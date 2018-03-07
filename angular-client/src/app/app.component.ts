import { Component } from '@angular/core';
import { Auth } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PLEAD';
  showBackBtn = false;

  constructor (
    private auth: Auth,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.location.path().indexOf('dashboard') !== 1 ? this.showBackBtn = true : this.showBackBtn = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    this.router.navigate(['login']);
  }

  goBack() {
    this.location.back();
  }
}
