import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RolesService } from "../../services/roles.service";
import { UsuariosRolesService } from "../../services/usuarios-roles.service";
import { MatDialog } from '@angular/material/dialog';
import { ModalEditarRolesUsuarios } from "./modalEditarRolesUsuarios/modalEditarRolesUsuarios.component";
import { ModalEditarRoles } from "./modalEditarRoles/modalEditarRoles.component";
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from "@angular/material/paginator";

@Component({
  selector: 'app-admin-rolesUsuarios',
  templateUrl: './rolesUsuarios.component.html',
  styleUrls: ['./rolesUsuarios.component.scss']
})
export class RolesUsuariosComponent implements OnInit {
  loading: boolean = false;
  loadingRoles: boolean = false;
  loadingUsuarios: boolean = false;
  roles: any = [];
  usuarios: any = [];
  usuariosRol: any = [];
  tieneUsuariosHijo: boolean = false;

  displayedColumnsRoles: string[] = ['nombre', 'descripcion', 'activoDesc', 'accion'];
  dataSourceRoles: MatTableDataSource<ItemRoles>;
  datosRoles: ItemRoles[] = [];

  displayedColumnsUsuarios: string[] = ['nombre', 'rol', 'activo','accion'];
  dataSourceUsuarios: MatTableDataSource<ItemUsuarios>;
  datosUsuarios: ItemUsuarios[] = [];

  rolResult: boolean = false;
  usuarioRolResult: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private usuariosRolesService: UsuariosRolesService,
    public dialog: MatDialog,
    private matPaginatorIntl: MatPaginatorIntl
  ) {
    this.matPaginatorIntl.itemsPerPageLabel = "Registros por página";
  }

  ngOnInit(): void {
    this.obtenerRoles();
    this.obtenerUsuarios();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.periodoPadre && changes.periodoPadre.currentValue) {
      this.ngOnInit();
    }
  }

  obtenerRoles() {
    this.loadingRoles = true;
    this.rolesService.getAllRoles()
      .subscribe(
        (val) => {
          this.roles = val;
          console.log("Roles");
          console.log(this.roles);
          if (this.roles.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'No se encontraron roles',
              text: 'Favor de agrgar un nuevo rol.'
            });
          }
          else {
            this.datosRoles = [];
            for (let x = 0; x < this.roles.length; x++)
              this.datosRoles.push(new ItemRoles(this.roles[x].id, this.roles[x].nombre, this.roles[x].descripcion, this.roles[x].activo, this.roles[x].activoDesc, ''));

            this.dataSourceRoles = new MatTableDataSource(this.datosRoles);
          }
          this.loading = false;
          this.loadingRoles = false;
        }, response => {
          console.log("obtenerCompetencias, ocurrió un error:", response);
          this.loading = false;
          this.loadingRoles = false;
        });
  }

  obtenerUsuarios() {
    this.loadingUsuarios = true;
    this.usuariosRolesService.getAllUsuarioRol()
      .subscribe(
        (val) => {
          this.usuarios = val;
          console.log("Usuarios");
          console.log(this.usuarios);
          if (this.usuarios.length === 0) {
            Swal.fire({
              icon: 'warning',
              title: 'No se encontraron usuarios',
              text: 'Favor de agragar un nuevo usuario.'
            });
          }
          else {
            this.datosUsuarios = [];
            for (let x = 0; x < this.usuarios.length; x++)
              this.datosUsuarios.push(new ItemUsuarios(this.usuarios[x].id, this.usuarios[x].id_empleado, this.usuarios[x].nombre, this.usuarios[x].roles.nombre, this.usuarios[x].id_rol, this.usuarios[x].activo, this.usuarios[x].activoDesc, ''));

            this.dataSourceUsuarios = new MatTableDataSource(this.datosUsuarios);
            this.dataSourceUsuarios.paginator = this.paginator;
            this.dataSourceUsuarios.sort = this.sort;
          }
          // this.loading = false;
          this.loadingUsuarios = false;
        }, response => {
          console.log("obtenerCompetencias, ocurrió un error:", response);
          // this.loading = false;
          this.loadingUsuarios = false;
        });
  }

  abrirAgregarRol(tipo: number) {
    const dialogRef = this.dialog.open(ModalEditarRoles, {
      width: '600px',
      height: '400px',
      data: {
        tipo: tipo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.obtenerRoles();
    });
  }
  abrirEditarRol(nombre, descripcion, activo, id) {
    const dialogRef = this.dialog.open(ModalEditarRoles, {
      width: '600px',
      height: '400px',
      data: {
        nombre: nombre,
        descripcion: descripcion,
        activo: activo,
        id: id,
        tipo: 2
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.obtenerRoles();
    });
  }

  abrirAgregarUsuario(tipo: number) {
    const dialogRef = this.dialog.open(ModalEditarRolesUsuarios, {
      width: '600px',
      height: '350px',
      data: {
        tipo: 1,
        id: 0,
        roles: this.roles
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.obtenerUsuarios();
    });
  }

  abrirEditarUsuario(nombre: string, id_rol: number, id_empleado: number, id: number, activo: number) {
    const dialogRef = this.dialog.open(ModalEditarRolesUsuarios, {
      width: '600px',
      height: '400px',
      data: {
        nombre: nombre,
        id_rol: id_rol,
        id_empleado: id_empleado,
        id: id,
        tipo: 2,
        roles: this.roles,
        activo: activo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.obtenerUsuarios();
    });
  }

  applyFilterRoles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRoles.filter = filterValue.trim().toLowerCase();
  }

  applyFilterUsuarios(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUsuarios.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceUsuarios.paginator) {
      this.dataSourceUsuarios.paginator.firstPage();
    }
  }

  borrarRol(ID: number) {
    this.obtenerUsuarioRol(ID);
    Swal.fire({
      title: '¿Está seguro de continuar con la eliminación?',
      text: '¡La información no podrá ser recuperada!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡bórralo!',
      cancelButtonText: 'No, mantenerlo'
    }).then((result) => {
      if (result.value) {
        if (!this.tieneUsuariosHijo) {
          this.EliminarRol(ID);
          Swal.fire(
            '¡Eliminado!',
            'El rol se eliminó correctamente',
            'success'
          )
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No es posible eliminar el rol',
            text: 'Favor de validar que no exista ningún usuario con el rol seleccionado.'
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.loading = false;
        Swal.close();
      }
    })
  }

  EliminarRol(ID: number) {
    this.rolesService.deleteRoles(ID)
      .subscribe(
        (val) => {
          this.rolResult = val;
          if (val) {
            this.obtenerRoles();
          }
          this.loading = false;
        }, response => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Ocurrió un error', text: 'Contacte al administrador' });
        });
  }

  obtenerUsuarioRol(id: number): any {
    this.usuariosRolesService.getUsuarioRolById(id)
      .subscribe(
        (val) => {
          this.usuariosRol = val;
          if (this.usuariosRol.length > 0) {
            this.tieneUsuariosHijo = true;
          }
          else {
            this.tieneUsuariosHijo = false;
          }

        }, response => {
          console.log("obtenerPeriodosHijo - ocurrió un error:", response);
        });
  }

  borrarUsuario(ID: number) {
    Swal.fire({
      title: '¿Está seguro de continuar con la eliminación?',
      text: '¡La información no podrá ser recuperada!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡bórralo!',
      cancelButtonText: 'No, mantenerlo'
    }).then((result) => {
      if (result.value) {
        this.EliminarUsuario(ID);
        Swal.fire(
          '¡Eliminado!',
          'El rol de usuario se eliminó correctamente',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.loading = false;
        Swal.close();
      }
    })
  }

  EliminarUsuario(ID: number) {
    this.usuariosRolesService.deleteUsuarioRol(ID)
      .subscribe(
        (val) => {
          this.usuarioRolResult = val;
          if (val) {
            this.obtenerUsuarios();
          }
          this.loading = false;
        }, response => {
          this.loading = false;
          Swal.fire({ icon: 'error', title: 'Ocurrió un error', text: 'Contacte al administrador' });
        });
  }
}


export class ItemRoles {
  constructor(
    public id: number,
    public nombre: string,
    public descripcion: string,
    public activo: boolean,
    public activoDesc: string,
    public acciones: string) {
  }
}

export class ItemUsuarios {
  constructor(
    public id: number,
    public id_empleado: number,
    public nombre: string,
    public rol: string,
    public id_rol: number,
    public activo: boolean,
    public activoDesc: string,
    public acciones: string) {
  }
}