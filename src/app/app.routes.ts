import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleCreateComponent } from './components/article-create/article-create.component';
import { ArticleEditComponent } from './components/article-edit/article-edit.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component";
import { RoleGuard } from "./services/role.guard";
import { AuthGuard } from "./services/auth.guard";
import {UserDashboardComponent} from "./components/user-dashboard/user-dashboard.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'articles', component: ArticleListComponent, canActivate: [RoleGuard] },
  { path: 'articles/create', component: ArticleCreateComponent, canActivate: [RoleGuard] },
  { path: 'articles/edit/:id', component: ArticleEditComponent, canActivate: [RoleGuard] },
  { path: 'articles/edit/:id/:selectedVersion/:status', component: ArticleEditComponent, canActivate: [RoleGuard] },
  { path: 'articles/:id/:status', component: ArticleDetailComponent, canActivate: [RoleGuard] },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [RoleGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { role: 'ROLE_ADMIN' } },
  { path: '**', redirectTo: 'login' },
];
