import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
const ELEMENT_DATA: PeriodicElement[] = [
  {nombre: 'Iphone 13 Pro Max', status: 'En proceso'},
  {nombre: 'Iphone 12 Pro', status: 'Entregado'},
  {nombre: 'Iphone 11', status: 'En oficina'},
  
];
export interface PeriodicElement {
  nombre: string;
  status: string;
}
@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.scss']
})


export class MisPedidosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'status'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor() { }

  ngOnInit(): void {
  }

  setColor(status: string) {
    switch(status) {
      case 'En proceso':
        return 'proceso';
      case 'Entregado':
        return 'entregado';
      case 'En oficina':
        return 'oficina';
    }
  }

}
