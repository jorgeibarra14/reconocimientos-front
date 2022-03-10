import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-migas',
  templateUrl: './store-migas.component.html',
  styleUrls: ['./store-migas.component.scss']
})
export class StoreMigasComponent implements OnInit {
  @Input() links: any = [];
  @Input() hasCart: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
