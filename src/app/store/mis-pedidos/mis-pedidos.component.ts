import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { PedidosService } from 'src/app/services/pedidos.service';
const ELEMENT_DATA: any[] = [
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
  dataSource;

  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private pedidosService: PedidosService, private authService: AuthService) {
    const user = authService.getCookieUser();
    this.obtenerPedidosPorUserId(user.Id);
   }

  ngOnInit(): void {
  }

  obtenerPedidosPorUserId(userId: string) {
    this.pedidosService.getPedidosByUserId(userId).subscribe(r => {
      let data = [];
      r.forEach(reg => {
        reg.productos.forEach(element => {
          
          let obj = {
            nombre: element.producto_nombre,
            status: reg.estatusPedido.estado
          }
          data.push(obj);
        });
      })


      this.dataSource = new MatTableDataSource(data);

      // this.dataSource = r;
    })
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
