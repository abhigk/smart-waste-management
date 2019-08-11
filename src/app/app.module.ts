import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { NguiMapModule} from '@ngui/map';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { TableComponent } from './table/table.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {HttpClientModule} from '@angular/common/http';
import {BinService} from './services/bin.service';
import { BinDataComponent } from './dashboard/bin-data/bin-data.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {SocketService} from './services/socket.service';
import {UserService} from './services/user.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {AuthService} from './services/auth.service';
import {AuthenticationService} from './services/authentication.service';
import { StatsComponent } from './stats/stats.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    TableComponent,
    IconsComponent,
    NotificationsComponent,
    BinDataComponent,
    LoginComponent,
    HomeComponent,
    StatsComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    SidebarModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCh6OO_hNeqm_-zg_zcENn2sfJeAOirGM0'}),
    LeafletModule.forRoot(), HttpClientModule,
      FormsModule, ReactiveFormsModule, NgMultiSelectDropDownModule.forRoot(),
      NgxChartsModule, BrowserAnimationsModule

  ],
  providers: [BinService, SocketService, UserService, AuthService, AuthenticationService],

  bootstrap: [AppComponent]
})
export class AppModule { }
