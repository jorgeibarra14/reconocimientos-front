import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ReconocimientosService } from 'src/app/services/reconocimientos.service';
import { AuthService } from "src/app/services/auth.service";
import { Producto } from 'src/app/shared/Models/producto';

declare const doActionAnimation: any;
declare const resetActionAnimation: any;
declare var $:JQueryStatic;

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {

  user: any = {
    Nombre: "",
    Id: 0,
    Foto:""
  };
  idEmpleadoLogeado:Number;

  tituloCat: any = "Todos los productos";
  idCat: number = 0;
  migas: any = [];
  productos: Producto[] = [];
  categorias: any[] = [];
  loading: boolean = false;
  puntosDisponibles: Number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    private categoriasService: CategoriasService,
    private reconocimientosService: ReconocimientosService,
    private authService: AuthService
  ) {
    this.user = this.authService.getCookieUser();   
    this.idEmpleadoLogeado = this.user.Id ; 
  }

  ngOnInit(): void {

    this.reconocimientosService.getPuntosAcumulados(this.idEmpleadoLogeado,true).subscribe(resp=>{
      this.puntosDisponibles=resp;
      // this.loading = false;
    });

    this.activatedRoute.params.subscribe(routeParams => {
      window.scrollTo(0,0);
      resetActionAnimation(); // reset animaciones util.js
      // console.log(routeParams.categoria);
      if(routeParams.categoria && routeParams.categoria != undefined){
        this.idCat = routeParams.categoria;
        this.getProductosByCategoria(routeParams.categoria);
      }else{
        this.getAllProductos();
      }
      this.migas = [
        // { name: 'Inicio', url: '/store' },
        { name: 'Inicio', url: '#' }
      ];
      // reset
      this.categorias = [];
    });
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
  getAllProductos(){
    this.loading = true;
    this.productoService.getProductos()
        .subscribe(
          resp => {
            // console.log(resp);
            this.productos = resp;
            this.setAnimation();

            this.getCategorias();

            this.loading = false;
          }, err => {
            this.loading = false;
          }
        )
  }
  getCategorias(){
    this.loading = true;
    this.categoriasService.getCategorias()
        .subscribe(
          resp => {
            // console.log(resp)
            this.categorias = resp;
            this.categorias.forEach((item) => {
              if(item.id == this.idCat){
                this.tituloCat = item.nombre;
              }
            });

            this.loading = false;
          }, err => {
            this.loading = false;
          }
        )
  }
  getProductosByCategoria(id: number){
    this.loading = true;
    this.productoService.getProductosByCategoryId(id)
    .subscribe(
      resp => {
        // console.log(resp);
        this.productos = resp;
        this.setAnimation();

        this.getCategorias();

        this.loading = false;
      }, err => {
        this.loading = false;
      }
    )
  }
}
