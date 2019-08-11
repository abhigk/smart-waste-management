import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { TableComponent } from './table/table.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {RouteGuard} from './route-guard';
import {LoginComponent} from './login/login.component';
import {StatsComponent} from './stats/stats.component';


export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },

    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'user',
        component: UserComponent,
    },
    {
        path: 'table',
        component: TableComponent,
    },
    {
        path: 'icons',
        component: IconsComponent
    },
    {
        path: 'notifications',
        component: NotificationsComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'stats',
        component: StatsComponent
    }
];
