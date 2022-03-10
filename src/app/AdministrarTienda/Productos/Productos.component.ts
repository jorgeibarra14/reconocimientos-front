import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { NumberPipe } from '@progress/kendo-angular-intl';
import { ModalAdminTiendaEditarProductos } from "../../AdministrarTienda/Productos/ModalAdminTiendaEditarProductos/ModalAdminTiendaEditarProductos.component";
import Swal from 'sweetalert2';
import { AuthService } from "../../services/auth.service";
import { ProductoService } from "../../services/producto.service";
import { CategoriasService } from "../../services/categorias.service";
import { splitBlock } from '@angular/localize/src/utils';
@Component({
    selector: 'ho1a-Admin-Productos',
    templateUrl: './Productos.component.html',
    styleUrls: ['./Productos.component.scss']
})
export class AdminTiendProductosComponent implements OnInit {

    loading: boolean = true;
    gridData: any = [];
    categorias: any = [];
    productoResult: boolean = true;
    idEmpleadoLogeado: Number;
    activo: Boolean;
    error: string;

    constructor(
        private productoService: ProductoService,
        private categoriasService: CategoriasService,
        private authService: AuthService,
        public dialog: MatDialog,
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;

        this.allData = this.allData.bind(this);

    }
    ngOnInit() {
        this.productoService.getProductos().subscribe(resp => {
            console.log("Productos:");
            console.log(resp);
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => { }
        );
        this.obtenerCategorias();
    }
    obtenerCategorias() {
        this.categoriasService.getCategorias().subscribe(resp => {
            // console.log("Categorias pa enviar:");
            // console.log(resp);
            this.categorias = resp;
        }, error => this.error = error,
            () => { }
        );
    }
    abrirEditar(nombre, descripcion, costo, stock, categoriaId, imagen, id) {
        const dialogRef = this.dialog.open(ModalAdminTiendaEditarProductos, {
            width: '800px',
            data: {
                nombre: nombre,
                descripcion: descripcion,
                costo: costo,
                stock: stock,
                categoria_id: categoriaId,
                img: imagen,
                id: id,
                tipo: 1,
                categorias: this.categorias
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.loading = true;
            this.refresh();
        });
    }

    refresh() {
        console.log("Refresh");
        this.activo = true;
        this.loading = true;

        this.productoService.getProductos().subscribe(resp => {
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => { }
        );
    }

    public allData(): ExcelExportData {
        const result: ExcelExportData = {
            data: this.gridData
        };
        return result;
    }

    abrirNuevo() {
        const dialogRef = this.dialog.open(ModalAdminTiendaEditarProductos, {
            width: '800px',
            data: {
                nombre: "",
                descripcion: "",
                costo: "",
                stock: "",
                categoria_id: "",
                img: "",
                id: "",
                tipo: 2,
                categorias: this.categorias
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            this.loading = true;
            this.refresh();
        });
    }

    borrarProducto(ID: number) {
        Swal.fire({
            title: '¿Está seguro de continuar con la eliminación?',
            text: '¡La información del producto no podrá ser recuperada!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, ¡bórralo!',
            cancelButtonText: 'No, mantenerlo'
        }).then((result) => {
            if (result.value) {
                this.EliminarProducto(ID);
                Swal.fire(
                    '¡Eliminado!',
                    'El producto se eliminó correctamente',
                    'success'
                )
                this.ngOnInit();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.loading = false;
                Swal.close();
            }
        })
    }


    EliminarProducto(ID: number) {
        this.loading = true;
        this.productoService.deleteProductos(ID)
            .subscribe(
                (val) => {
                    this.productoResult = val;
                    if (val) {
                        this.ngOnInit();
                    }
                    this.loading = false;
                }, response => {
                    this.loading = false;
                    Swal.fire({ icon: 'error', title: 'Ocurrió un error', text: 'Contacte al administrador' });
                });
    }
}