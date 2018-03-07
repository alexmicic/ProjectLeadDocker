import { Component, OnInit } from '@angular/core';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  dateCreated: Date;
  phone: string;
  email: string;
  password: string;
  admin: boolean;
  teams: [string];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}