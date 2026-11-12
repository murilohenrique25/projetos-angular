import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { CuponsComponent } from './pages/cupons/cupons.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/noAuth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // rota padrão para login
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'produtos', component: ProdutosComponent, canActivate: [AuthGuard] },
    { path: 'cupons', component: CuponsComponent, canActivate: [AuthGuard] },
    { path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
    { path: 'relatorios', component: RelatoriosComponent, canActivate: [AuthGuard] },
    { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/login' }  // rota para fallback também vai para login
];

