import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { NumberPipe } from '@progress/kendo-angular-intl';
import { ModalAdminTiendaEditarCategoria } from "../../AdministrarTienda/Categorias/ModalAdminTiendaEditarCategoria/ModalAdminTiendaEditarCategoria.component";
import Swal from 'sweetalert2';
import { AuthService } from "../../services/auth.service";
import { CategoriasService } from "../../services/categorias.service";
@Component({
    selector: 'ho1a-Admin-Categorias',
    templateUrl: './Categorias.component.html',
    styleUrls: ['./Categorias.component.scss']
})
export class AdminTiendaCategoriasComponent implements OnInit {

    loading: boolean = true;
    gridData: any = [];

    idEmpleadoLogeado: Number;
    activo: Boolean;
    error: string;
    categoriaResult: boolean = true;

    constructor(
        private categoriasService: CategoriasService,
        private authService: AuthService,
        public dialog: MatDialog,
    ) {
        const user = this.authService.getCookieUser();
        this.idEmpleadoLogeado = user.Id;
        this.activo = true;

        this.allData = this.allData.bind(this);
    
    }
    ngOnInit(){
        this.categoriasService.getCategorias().subscribe(resp =>{
            console.log("Categorias:");
            console.log(resp);
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => {}
        );
    }

    abrirEditar(nombre, descripcion, nivel, img, id){
        const dialogRef = this.dialog.open(ModalAdminTiendaEditarCategoria, {
            width: '500px',
            data: { 
                nombre: nombre,
                descripcion: descripcion,
                nivel: nivel,
                img: img,
                id: id,
                tipo: 1,
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

        this.categoriasService.getCategorias().subscribe(resp =>{
            this.gridData = resp;
            this.loading = false;
        }, error => this.error = error,
            () => {}
        );
    }

    public allData(): ExcelExportData {
        const result: ExcelExportData =  {
            data: this.gridData
        };
        return result;
    }

    abrirNuevo(){
        const dialogRef = this.dialog.open(ModalAdminTiendaEditarCategoria, {
            width: '500px',
            data: { 
                nombre: "",
                descripcion: "",
                nivel: "",
                img: "",
                id: "",
                tipo: 2
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            this.loading = true;
            this.refresh();
        });
    }

    borrarCategoria(ID: number) {
        Swal.fire({
          title: '¿Está seguro de continuar con la eliminación?',
          text: '¡La información de la categoria no podrá ser recuperada!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, ¡bórralo!',
          cancelButtonText: 'No, mantenerlo'
        }).then((result) => {
          if (result.value) {
            this.EliminarCategoria(ID);
            Swal.fire(
              '¡Eliminada!',
              'La categoria se eliminó correctamente',
              'success'
            )
            this.ngOnInit();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.loading = false;
            Swal.close();
          }
        })
      }


      EliminarCategoria(ID: number) {
        this.loading = true;
        this.categoriasService.deleteCategorias(ID)
          .subscribe(
            (val) => {
              this.categoriaResult = val;
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