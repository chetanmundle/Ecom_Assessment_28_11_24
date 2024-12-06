import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { OrgComponent } from './pages/org/org/org.component';
import { HomeComponent } from './pages/org/home/home.component';
import { authGuard } from './core/Guards/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { CartComponent } from './pages/org/Customer/cart/cart.component';
import { ProfileComponent } from './pages/org/profile/profile.component';
import { InvoiceComponent } from './pages/org/Customer/invoice/invoice.component';
import { OrdersComponent } from './pages/org/Customer/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'org/Home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'Login',
        component: LoginComponent,
      },
      {
        path: 'Register',
        component: RegisterComponent,
      },
      {
        path: 'Forgot-Password',
        component: ForgotPasswordComponent,
      },
    ],
  },
  {
    path: 'org',
    component: OrgComponent,
    children: [
      {
        path: 'Home',
        component: HomeComponent,
        title: 'Home Page',
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Customer'] },
      },
      {
        path: 'Profile',
        component: ProfileComponent,
        title: 'Profile Page',
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Customer'] },
      },
      {
        path: 'Customer/Cart',
        component: CartComponent,
        title: 'Cart Page',
        canActivate: [authGuard],
        data: { roles: ['Customer'] },
      },
      {
        path: 'Customer/Invoice/:id',
        component: InvoiceComponent,
        title: 'Invoice Page',
        canActivate: [authGuard],
        data: { roles: ['Customer'] },
      },
      {
        path: 'Customer/Orders',
        component: OrdersComponent,
        title: 'Order Page',
        canActivate: [authGuard],
        data: { roles: ['Customer'] },
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
