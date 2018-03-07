import { Component, OnInit } from '@angular/core';

export class Comment {
  id: string;
  desc: string;
  dateCreated: Date;
  user: string;
  userFullName: string;
  issue: string;
}

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
