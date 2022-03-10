import { Component, Input, OnInit } from '@angular/core';

import { Producto } from 'src/app/shared/Models/producto';

@Component({
  selector: 'app-store-product-grid',
  templateUrl: './store-product-grid.component.html',
  styleUrls: ['./store-product-grid.component.scss']
})
export class StoreProductGridComponent implements OnInit {
  @Input() producto: Producto;

  constructor() { }

  ngOnInit(): void {
  }
  /**
   * PONER BOTON EL OTRO COLOR Y "SIN STOCK" cuando no haya stock
   */

}
