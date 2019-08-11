import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";

declare var $:any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'ti-panel', class: '' },
    { path: 'user', title: 'Profile',  icon:'ti-user', class: '' },
    { path: 'table', title: 'Groups',  icon:'ti-view-list-alt', class: '' },
    { path: 'stats', title: 'Stats',  icon:'ti-stats-up', class: '' }
    ];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    adminEmails = [];
    isAdmin:boolean = false;

    constructor(private userService:UserService){

    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.getAdmin();
    }
    getAdmin(){
        this.userService.getAdmins()
            .subscribe(data =>{
                //console.log('ADMIN DATA --->',data);
                for (const key in data) {
                    const user = data[key];
                    this.adminEmails.push(user.email);
                }
                //console.log('ADMIN ARRAY -->',this.adminEmails);
                this.checkIsAdmin();
            },
                error =>{

                });
    }

    checkIsAdmin(){
        let loggedInUser = localStorage.getItem('currentUser');
        for (let i = 0; i < this.adminEmails.length ; i++){
            if(this.adminEmails[i]==loggedInUser){
                this.isAdmin = true;
            }

        }
    }



    checkAccess(title){
        if(title=='Groups'&&this.isAdmin==false){
            return false;
        }else{
            return true;
        }

    }

    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

}
