import { Component, OnInit, Inject , SimpleChanges, OnChanges, ElementRef, ViewChild,NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../../services/auth.service";
import { ProductoService } from "../../../services/producto.service";
import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-ModalAdminTiendaEditarProductos',
    templateUrl: './ModalAdminTiendaEditarProductos.component.html',
    styleUrls: ['./ModalAdminTiendaEditarProductos.component.scss']
})
export class ModalAdminTiendaEditarProductos implements OnInit {

    formulario: FormGroup;
    file: any;
    idProducto: number = 0;
    enviado: boolean = false;
    activo: boolean = true;
    categoriaSeleccionada: string;
    tipo: boolean = false;
    titulo: string;
    categorias: any = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalAdminTiendaEditarProductos>,
        private fb: FormBuilder,
        private productoService: ProductoService
    ) {
        this.formulario = this.fb.group({
            producto: [this.data.nombre, [Validators.required, Validators.maxLength(50)]],
            descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(1000)]],
            costo: [this.data.costo, Validators.required],
            stock: [this.data.stock, Validators.required],
            archivo: [''],
            categoria_id: [this.data.categoria_id, Validators.required]
        });
        this.categorias = this.data.categorias;
        this.file = this.data.img;
        this.idProducto = this.data.id;
        this.categoriaSeleccionada = this.data.categoria_id;
        console.log("Categorias recibidas")
        console.log(this.categorias);
    }

    vacioValidator(control: FormControl) {
        let value = control.value;
        if (value && value.length > 0 && value.trim() != "") {
            return null;
        }
        return { vacio: true };
    }

    ngOnInit() {
        if (this.data.tipo == 1) {
            this.tipo = false;
            this.titulo = "Editar producto";
        }
        else {
            this.tipo = true;
            this.titulo = "Agregar producto";
        }
    }

    guardar() {
        if (this.formulario.valid) {
            this.enviado = true;
            if (this.data.tipo == 1) {
                let envioUpdate = {
                    "id": Number(this.idProducto),
                    "nombre": this.formulario.controls['producto'].value,
                    "descripcion": this.formulario.controls['descripcion'].value,
                    "costo": Number(this.formulario.controls['costo'].value),
                    "stock": Number(this.formulario.controls['stock'].value),
                    "imagen": this.file,
                    "categoria_id": Number(this.formulario.controls['categoria_id'].value),
                    "Activo": this.activo
                };
                this.productoService.updateProductos(envioUpdate)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se modifico el producto.'
                            });
                            this.enviado = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Modificación exitosa!',
                                text: 'El producto se modifico correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                }else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                                    this.enviado = false;
                                    this.dialogRef.close();
                                    Swal.close();
                                }
                            });
                        }
                    );
            } else {
                let envioAdd = {
                    "nombre": this.formulario.controls['producto'].value,
                    "descripcion": this.formulario.controls['descripcion'].value,
                    "costo": Number(this.formulario.controls['costo'].value),
                    "stock": Number(this.formulario.controls['stock'].value),
                    "imagen": this.file,
                    "categoria_id": Number(this.formulario.controls['categoria_id'].value),
                    "Activo": this.activo
                };
                this.productoService.addProductos(envioAdd)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se agrego el producto.'
                            });
                            this.enviado = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Registro existoso',
                                text: 'El producto se agrego correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                }else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                                    this.enviado = false;
                                    this.dialogRef.close();
                                    Swal.close();
                                }
                            });
                        }
                    );
            }
        } else {
            this.enviado = false;
        }
    }

    fileChanged(e) {
        this.file = e.target.files[0];
        this.uploadFile();
    }
    uploadFile() {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.file = fileReader.result;
            //console.log("this.file");
            //console.log(this.file);
        }
        fileReader.readAsDataURL(this.file);
    }
}