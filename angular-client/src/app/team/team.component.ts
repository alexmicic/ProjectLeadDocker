import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth.service';

export class Team {
  id: string;
  name: string;
  project: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  id: string;
  errorMessage: string;

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Teams');
  }

}


