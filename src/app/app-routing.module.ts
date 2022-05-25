import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './Login/Login.component';
import { InicioComponent } from './Inicio/Inicio.component';
import { MisReconocimientosComponent } from './MisReconocimientos/MisReconocimientos.component';
import { ReconocerAOtrosComponent } from "./ReconocerAOtros/ReconocerAOtros.component";
import { EnviarReconocimientoComponent } from "./ReconocerAOtros/EnviarReconocimiento/EnviarReconocimiento.component";
import { AdminInicioComponent } from './Administrador/Inicio/Inicio.component';
import { AdminAutorizadoresComponent } from "./Administrador/Autorizadores/Autorizadores.component";
import { AdminConceptosPuntosComponent } from "./Administrador/Competencias/Competencias.component";
import { AdminPuntosComponent } from "./Administrador/Puntos/Puntos.component";
import { ProductoStoreComponent } from './store/producto/producto.component';
import { CatalogoComponent } from './store/catalogo/catalogo.component';
import { MisPedidosComponent } from "./store/mis-pedidos/mis-pedidos.component";
import { AdminTiendaCategoriasComponent } from './AdministrarTienda/Categorias/Categorias.component';
import { AdminTiendProductosComponent } from './AdministrarTienda/Productos/Productos.component';
import { AdminInicioStoreComponent } from './AdministrarTienda/InicioStore/InicioStore.component';

import { UserGuard } from './shared/Guards/user.guard';
import { AdminGuard } from './shared/Guards/admin.guard';
import { AdminStoreGuard } from "./shared/Guards/admin-store.guard";
import { RhAdminGuard } from "./shared/Guards/rh-admin.guard";
import { UserVendedorGuard } from "./shared/Guards/user-vendedor.guard";
import { UserNormalGuard } from "./shared/Guards/user-normal.guard";
import { RolesUsuariosComponent } from './Administrador/rolesUsuarios/rolesUsuarios.component';

const routes: Routes = [
  /**
   * GENERAL
   */
  { path: 'Login', component: LoginComponent },
  { path: 'Inicio', canActivate: [UserGuard], component: InicioComponent },
  { path: 'rolesUsuarios', canActivate: [UserGuard], component: RolesUsuariosComponent },
  /**
   * NO COMERCIAL (RECONOCER)
   */
  { path: 'mis-reconocimientos', canActivate: [UserGuard, UserNormalGuard], component: MisReconocimientosComponent },
  {
    path: 'reconocer', children: [
      { path: '', canActivate: [UserGuard, UserNormalGuard], component: ReconocerAOtrosComponent },
      { path: 'enviar-reconocimiento', canActivate: [UserGuard, UserNormalGuard], component: EnviarReconocimientoComponent }
    ]
  },
  /**
   * COMERCIAL (STORE)
   */
  {
    path: 'store', children: [
      { path: '', canActivate: [UserGuard], component: CatalogoComponent },
      { path: 'mis-pedidos', canActivate: [UserGuard], component: MisPedidosComponent },
      { path: 'producto/:id', canActivate: [UserGuard], component: ProductoStoreComponent },
      { path: ':categoria', canActivate: [UserGuard], component: CatalogoComponent },
    ]
  },
  /**
   * ADMIN
   */
  {
    path: 'admin', children: [
      { path: '', canActivate: [RhAdminGuard], component: AdminInicioComponent },
      { path: 'autorizadores', canActivate: [AdminGuard], component: AdminAutorizadoresComponent },
      { path: 'competencias', canActivate: [AdminGuard], component: AdminConceptosPuntosComponent },
      { path: 'puntos', canActivate: [AdminGuard], component: AdminPuntosComponent }
    ]
  },
  /** */
  /**
 * ADMINTIENDA
 */
  {
    path: 'admin-store', children: [
      { path: '', canActivate: [AdminStoreGuard], component: AdminInicioStoreComponent },
      { path: 'categorias', canActivate: [AdminStoreGuard], component: AdminTiendaCategoriasComponent },
      { path: 'productos', canActivate: [AdminStoreGuard], component: AdminTiendProductosComponent }
    ]
  },

  /** */
  { path: '**', redirectTo: '/Inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [UserGuard, AdminGuard, AdminStoreGuard, RhAdminGuard, UserVendedorGuard, UserNormalGuard],
})
export class AppRoutingModule { }
