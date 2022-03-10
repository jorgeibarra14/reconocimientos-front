import { Component, ElementRef, OnInit, ViewChild, Renderer2, Input, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, Route } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ReconocimientosService } from 'src/app/services/reconocimientos.service';
import { PedidosService } from "src/app/services/pedidos.service";

import { Producto } from "../../shared/Models/producto";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito-store',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoStoreComponent implements OnInit, OnChanges, AfterViewInit  {
  @ViewChild('menuCart') menuCart: ElementRef;
  @Input() itemAddCart: any = {};
  itemsCartDiffer: any; // Variable clonada de itemsCart para saber si cambió su contenido

  user: any = {
    Nombre: "",
    Id: 0,
    Foto:"",
  };
  idEmpleadoLogeado: number;
  datosUser: any = {
    nombreCompleto: "",
    puesto: "",
    area: "",
    sistema: ""
  };
  puntosDisponibles: number = 0;
  esUsuarioNormal: boolean = true;

  // topSize: number = 0;
  itemsCart: any = [];
  productos: Producto[] = [];
  subtotal: number = 0;
  cantidadItems: number = 0;
  //Alerts
  // textoDanger: string = '';
  // alertSuccess: boolean = false;
  // alertDanger: boolean = false;

  loading: boolean = false;
  // currentRoute: string = '';

  constructor(
    // private renderer: Renderer2,
    // private router: Router,
    private cdRef: ChangeDetectorRef,
    private productoService: ProductoService,
    private reconocimientoService: ReconocimientosService,
    private authService: AuthService,
    private pedidosService: PedidosService
  ) {
    this.user = this.authService.getCookieUser();
    this.idEmpleadoLogeado = this.user.Id;
    //Demo
    // localStorage.setItem('cart', JSON.stringify(this.demoItemsCart));
  }

  ngOnInit(): void {
    this.loading = true;
    this.reconocimientoService.getEmpleadosPorId(this.idEmpleadoLogeado.toString())
          .subscribe(
            resp => {
              this.datosUser = resp[0];

              this.mostrarEnlaces();
              // console.log(this.datosUser);
              // this.loading = false;
              /**
               * FALTA LA RUTA API QUE SUME COMISIONES + MIS RECONOCIMIENTOS
               */
              this.reconocimientoService.getPuntosAcumulados(this.idEmpleadoLogeado, true).subscribe(
                  resp=>{
                      this.puntosDisponibles = resp;
                      this.loading = false;
                  });
            }, err => {
              console.log('ERROR al obtener el usuarioById');
              this.loading = false;
            }
          )
  }
  ngAfterViewInit() {
    if( !(this.itemsCart = JSON.parse(localStorage.getItem("cart"))) ){
      this.itemsCart = [];
    }else{
      this.validarItemsCarrito();
    }

    // this.moveOnScrollMenu();

    this.calcularSubtotal();

    // Para que no salga un error de detección de cambios en la consola
    this.cdRef.detectChanges();
  }
  ngOnChanges(change: SimpleChanges) {
    if(change.itemAddCart && change.itemAddCart.currentValue){
      // console.log("cambio cart from parent");
      //Add to cart item
      var productoAdd = change.itemAddCart.currentValue;
      //Revisar si existe en el carrito
      var existeEnCarrito = false;
      this.itemsCart.forEach(el => {
        // console.log("el.id("+el.id+") == productoAdd.id("+productoAdd.id+")")
        if(el.id == productoAdd.id){
          // console.log("entra a: " + productoAdd.id);
          existeEnCarrito = true;
          this.loading = true;
          this.productoService.getProductoById(productoAdd.id)
              .subscribe(
                resp => {

                  el.qty = this.actualizarCantidad(productoAdd.qty, el.qty, resp[0].stock);
                  this.actualizarLocalStorageCarrito();

                  this.calcularSubtotal();

                  this.loading = false;
                }, err => {
                  this.loading = false;
                }
              )
          return;
        }
      });
      if(!existeEnCarrito){
        if(productoAdd.id){
          this.loading = true;
          this.productoService.getProductoById(productoAdd.id)
              .subscribe(
                resp => {

                  productoAdd.qty = this.actualizarCantidad(productoAdd.qty, 0, resp[0].stock);
                  this.itemsCart.push(productoAdd);
                  this.actualizarLocalStorageCarrito();

                  this.calcularSubtotal();

                  this.loading = false;
                }, err => {
                  this.loading = false;
                }
              )
        }
      }
    }
  }
  // Set position menu-cart in front
  // moveOnScrollMenu(){
  //   var widthDevice = window.innerWidth;
  //   // Detectar si es movil
  //   if(widthDevice <= 385.5){
  //     this.topSize = 190; // Tamaño del navbar
  //   }else if(widthDevice <= 991.5){
  //     this.topSize = 130; // Tamaño del navbar
  //   }else{
  //     this.topSize = 80; // Tamaño del navbar
  //   }
  //   //Valores por defecto
  //   setTimeout(() => this.moveOnScrollMenuSetDistance(window.scrollY), 1);
  //   this.renderer.setStyle(this.menuCart.nativeElement, 'top', this.topSize + 'px');

  //   window.addEventListener('scroll',(event) => {
  //     this.moveOnScrollMenuSetDistance(window.scrollY);
  //   }, false);
  // }
  // moveOnScrollMenuSetDistance(iHeight: number){
  //   // console.log("this.topSize("+this.topSize+") <= iHeight("+iHeight+"): ", this.topSize <= iHeight);
  //   var sTop = this.topSize - iHeight;
  //   if(sTop <= 0){
  //     this.renderer.setStyle(this.menuCart.nativeElement, 'top', '5px');
  //   }else{
  //     this.renderer.setStyle(this.menuCart.nativeElement, 'top', sTop + 'px');
  //   }
  // }
  //
  validarItemsCarrito(){
    var i = 0;
    var itemsCartTmp = JSON.parse(JSON.stringify(this.itemsCart));
    this.itemsCart = [];
    itemsCartTmp.forEach(el => {
      this.loading = true;
      this.productoService.getProductoById(el.id)
              .subscribe(
                resp => {
                  if(resp[0].stock >= el.qty){
                    this.itemsCart.push({
                        id: el.id,
                        img: resp[0].imagen,
                        nombre: resp[0].nombre,
                        precio: resp[0].costo,
                        qty: el.qty,
                        stock: resp[0].stock
                      });
                  }
                  this.loading = false;
                  this.calcularSubtotal();
                  this.actualizarLocalStorageCarrito();
                }, err => {
                  console.log("No se encontró el producto: "+el.id);
                  this.loading = false;
                }
              );
    });
    if(itemsCartTmp.length == 0){
      this.loading = false;
    }
    // console.log(itemsCartTmp);
  }
  calcularSubtotal(){
    this.subtotal = 0;
    this.itemsCart.forEach(item => this.subtotal += item.precio * item.qty );
    this.cantidadItems = 0;
    this.itemsCart.forEach(item => this.cantidadItems += item.qty );
  }
  //Acción del boton + - item del carrito
  cambioQty(id: number, newValue: number){
    this.loading = true;
    if(newValue <= 0){ // Eliminar el item del carrito
      this.eliminarItemDelCarrito(id);
      this.loading = false;
    }else{
      this.itemsCart.forEach(item => {
        if(id == item.id){
          // Revisar si no pone más que el stock
          item.qty = (item.stock < newValue)?item.stock:newValue;
          this.calcularSubtotal();
          this.actualizarLocalStorageCarrito();
          this.loading = false;
          return;
        }
      });
    }
  }
  eliminarItemDelCarrito(id: number){
    this.itemsCart.forEach((item, index, object) => {
      if(id == item.id){
        this.itemsCart.splice(index, 1);
        this.calcularSubtotal();
        this.actualizarLocalStorageCarrito();
        return;
      }
    });
  }
  actualizarCantidad(cantidad: number, cantidadActual:number, stock: number): number{
    var sumatoria = cantidad + cantidadActual;
    // this.alertDanger = false; this.alertSuccess = false; this.textoDanger = '';
    if(stock < sumatoria){
      // this.textoDanger = 'No hay suficiente stock para añadir '+(sumatoria - stock)+' más';
      // this.alertDanger = true;
      // setTimeout(() => this.alertDanger = false, 3500);
      Swal.fire({
        icon: 'error',
        title: 'Carrito',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        text: 'No hay suficiente stock para añadir '+(sumatoria - stock)+' más',
        timer: 5000,
        timerProgressBar: true,
      });
      return stock;
    }else{
      // this.alertSuccess = true;
      Swal.fire({
          icon: 'success',
          title: 'Carrito',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Se añadió el producto.',
          timer: 5000,
          timerProgressBar: true,
      });
      // setTimeout(() => this.alertSuccess = false, 3500);
      return sumatoria;
    }
    // return (stock < sumatoria)?stock:sumatoria;
  }
  actualizarLocalStorageCarrito(){
    localStorage.setItem('cart', JSON.stringify(this.itemsCart));
  }
  //Pedido
  guardarPedido(){
    this.loading = true;
    // console.log(this.itemsCart);
    var productos = [];
    this.itemsCart.forEach(el => {
      var tmp = {
        "producto_id": el.id,
        "producto_nombre": el.nombre,
        "producto_costo": el.precio,
        "producto_imagen": el.img,
        "cantidad": el.qty
      };
      productos.push(tmp);
    });
    let envio = {
      "id_solicitante": this.idEmpleadoLogeado,
      "nombre_solicitante": this.datosUser.nombreCompleto,
      "puesto_solicitante": this.datosUser.puesto,
      "area_solicitante": this.datosUser.area,
      "sistema_solicitante": this.datosUser.sistema,
      "productos": productos
    }
    // console.log(envio);
    this.pedidosService.addPedidos(envio)
        .subscribe(
          resp => {
            console.log(resp);
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Enviado a autorización',
            //   text: 'La información se guardo correctamente.',
            //   allowOutsideClick: false
            // }).then((result) => {
            //   this.router.navigate([`/store/mis-pedidos`]);
            // });;
            Swal.fire({
              icon: 'success',
              title: 'Enviado a autorización',
              text: 'La información se guardó correctamente.',
              allowOutsideClick: false
            });
            this.itemsCart = [];
            this.actualizarLocalStorageCarrito();
            this.loading = false;
          }, err => {
            console.log("Error: ", err);
            if(err.error && err.error == 'No hay stock suficiente para realizar el pedido' ){
              Swal.fire({
                icon: 'error',
                title: 'No hay stock',
                text: 'No hay stock suficiente para realizar el pedido.'
              });
            }else{
              //Genérico
              Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error',
                text: 'Favor de contactar al administrador.'
              });
            }
            this.loading = false;
          }
        )
  }
  //Validar link a mostrar
  mostrarEnlaces(){
    /**
     * FALTA DEFINIR SI SERÁ POR PUESTO, ÁREA O SISTEMA,
     * Y SI EL SERVICIO TENDRÁ UN CAMPO PARA VALIDACIÓN O SERÁ DESDE EL FRONT
     */
    // if(this.datosUser.puesto == 'CONSULTOR FUNCIONAL'){
    if(this.datosUser.area == 'COMERCIAL'){
      this.esUsuarioNormal = false;
    }else{
      this.esUsuarioNormal = true;
    }
  }
}
