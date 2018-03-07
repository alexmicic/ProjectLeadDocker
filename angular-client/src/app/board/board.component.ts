import { Component, OnInit } from '@angular/core';

export class Board {
  id: string;
  name: string;
  type: string;
  project: string;
  columns: [string];
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
