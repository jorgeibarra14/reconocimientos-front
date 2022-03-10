import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { __assign } from 'tslib';

import { Producto } from "../../shared/Models/producto";

import { ProductoService } from "../../services/producto.service";

declare const doActionAnimation: any;
declare const resetActionAnimation: any;
declare var $:JQueryStatic;

@Component({
  selector: 'app-producto-store',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoStoreComponent implements OnInit, AfterViewInit {

  migas: any = [];

  producto = {} as Producto;
  productos: Producto[] = [];
  productoId: number = 0;
  productoAddCart: any = {};
  cantidad: number = 1;

  loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(routeParams => {
      window.scrollTo(0,0);
      // console.log(routeParams)
      this.productoId = parseInt(routeParams.id);
      // console.log(this.productoId);
      resetActionAnimation(); // reset animaciones util.js
      this.getProducto();
    });
  }
  ngAfterViewInit() {
    // this.setAnimation();
  }
  setAnimation(){
    // util.js
    setTimeout(()=>{
      doActionAnimation($(".animatedRec")); // Primer animacion
      setTimeout(() =>{
        //On Scroll animacion
        window.addEventListener('scroll',(event) => {
          doActionAnimation($(".animatedRec"));
        }, false);
      }, 100);
    }, 30);
  }
  cambioQty(newValue: number){
    if(newValue > 0){ 
      this.cantidad = (this.producto.stock < newValue)?this.producto.stock:newValue;
    }
  }
  anadirAlCarrito(){
    this.productoAddCart = {
        id: this.producto.id,
        img: this.producto.imagen, 
        nombre: this.producto.nombre, 
        precio: this.producto.costo,
        qty: this.cantidad,
        stock: this.producto.stock
      };
  }
  getProducto(){
    this.loading = true;
    this.productoService.getProductoById(this.productoId)
        .subscribe(
          resp => {
            this.producto = resp[0];
            // console.log(this.producto)
            this.setAnimation();

            this.migas = [
              { name: 'Tienda', url: '/store' },
              // { name: 'Catálogo', url: '/store/catalogo' },
              { name: this.producto.nombre, url: '#' }
            ];

            this.loading = false;
            this.getProductosByCategoriaId();
          },  err => {
            this.loading = false;
          }
        );
  }
  getProductosByCategoriaId(){
    this.loading = true;
    this.productoService.getProductosByCategoryId(this.producto.categoria_id)
        .subscribe(
          resp => {
            this.productos = resp;
            // console.log(resp);
            this.loading = false;
          }, err => {
            this.loading = false;
          }
        )
  }

}
