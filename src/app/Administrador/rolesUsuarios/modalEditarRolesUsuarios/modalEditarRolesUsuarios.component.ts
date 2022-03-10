
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosRolesService } from "../../../services/usuarios-roles.service";
import { ColaboradoresService } from "../../../services/colaboradores.service";
import Swal from 'sweetalert2';

@Component({
    selector: 'ho1a-modalEditarRolesUsuarios',
    templateUrl: './modalEditarRolesUsuarios.component.html',
    styleUrls: ['./modalEditarRolesUsuarios.component.scss']
})
export class ModalEditarRolesUsuarios implements OnInit {

    form: FormGroup;
    file: any;
    idUsuarioRol: number = 0;
    form_valid: boolean = false;
    loading: boolean = false;

    esEdicion = false;
    resultadoBusquedaColaborador: any = [];
    currentColaboradorId: number = 0;
    currentId_Mga_PlazasMh: number = 0;
    rolesRecividos: any = [];

    isReadOnly: boolean = false;
    esNuevo: boolean = false;

    EsActivo = [
        { id: 1, descripcion: 'Si' },
        { id: 0, descripcion: 'No' }
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ModalEditarRolesUsuarios>,
        private fb: FormBuilder,
        private usuariosRolesService: UsuariosRolesService,
        private colaboradoresService: ColaboradoresService
    ) {
        this.form = this.fb.group({
            id_empleado: ['', Validators.required],
            id_rol: ['', Validators.required],
            activo: ['', Validators.required]
        });
        this.idUsuarioRol = this.data.id;
        this.rolesRecividos = data.roles;
    }

    ngOnInit() {
        if (this.data.tipo == 2) {//Editar
            this.esEdicion = true;
            this.esNuevo = false;
            this.isReadOnly = true;
            this.currentId_Mga_PlazasMh = this.data.id_empleado;
            var act = this.data.activo ? 1 : 0;
            this.form.setValue({
                id_empleado: this.data.nombre,
                id_rol: this.data.id_rol,
                activo: act
            });
        }
        else if (this.data.tipo == 1) {//Nuevo
            this.esEdicion = false;
            this.isReadOnly = false;
            this.esNuevo = true;
            this.form.setValue({
                id_empleado: '',
                id_rol: '',
                activo: 1
            });
        }
    }

    guardar() {
        this.loading = true;
        if (this.form.valid) {
            if (this.data.tipo == 1) { //Nuevo
                let envio = {
                    "id": 0,
                    "id_empleado": this.currentId_Mga_PlazasMh,
                    "id_rol": this.form.controls['id_rol'].value,
                    "activo": Boolean(1)
                };
                this.usuariosRolesService.addUsuarioRol(envio)
                    .subscribe(
                        (val) => { },
                        response => {
                            if (response.error === "Usuario duplicado") {
                                Swal.fire({
                                  icon: 'warning',
                                  title: 'No es posible agregar el rol de usuario',
                                  text: 'El colaborador seleccionado ya tiene un rol asignado.'
                                });
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Ocurrió un error',
                                  text: 'No se guardó el rol de usuario.'
                                });
                              }
                            this.loading = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Registro exitoso',
                                text: 'El rol de usuario se guardó correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                }
                            });
                            this.loading = false;
                            this.dialogRef.close();
                        }
                    );
            }
            else if (this.data.tipo == 2) { //Editar

                let envioUpdate = {
                    "id": this.idUsuarioRol,
                    "id_empleado": this.currentId_Mga_PlazasMh,
                    "id_rol": Number(this.form.controls['id_rol'].value),
                    "activo": Boolean(this.form.controls['activo'].value)
                };
                this.usuariosRolesService.updateUsuarioRol(envioUpdate)
                    .subscribe(
                        (val) => { },
                        response => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Ocurrió un error',
                                text: 'No se modificó el rol de usuario.'
                            });
                            this.loading = false;
                        },
                        () => {
                            Swal.fire({
                                title: 'Modificación exitosa',
                                text: 'El rol de usuario se modificó correctamente.',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    this.dialogRef.close();
                                }
                            });
                            this.loading = false;
                            this.dialogRef.close();
                        }
                    );
            }
        } else {
            this.form_valid = true;
            this.loading = false;
        }
    }

    buscarColaboradores(nombre: string) {
        this.colaboradoresService.getColaboradoresByNombre(nombre)
            .subscribe(
                (val) => {
                    this.resultadoBusquedaColaborador = val;
                    // console.log("resultadoBusquedaColaborador:")
                    // console.log(this.resultadoBusquedaColaborador)
                },
                response => {
                    console.log("buscarColaboradores ocurrió un error:", response)
                },
                () => { });
    }

    setCurrentColaboradorId(id: number, id_Mga_PlazasMh: number) {
        this.currentColaboradorId = id;
        this.currentId_Mga_PlazasMh = id_Mga_PlazasMh;
    }

}
