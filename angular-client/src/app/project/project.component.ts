import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../auth/auth.service';

export class Project {
  id: string;
  name: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  id: string;
  errorMessage: string;

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Project');
  }

}
