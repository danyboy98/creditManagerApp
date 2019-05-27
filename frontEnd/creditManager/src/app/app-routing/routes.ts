import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { UsersComponent } from '../users/users.component';
import { UserdetailsComponent } from '../userdetails/userdetails.component';
import { TransfersComponent } from '../transfers/transfers.component';

export const routes: Routes = [
    { path: 'home',  component: HomeComponent },
    { path: 'users',  component: UsersComponent },
    { path: 'userdetails/:id',  component: UserdetailsComponent },
    { path: 'transfers/:id',  component: TransfersComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];