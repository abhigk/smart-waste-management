import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {UserService} from "../../services/user.service";
import {SocketService} from "../../services/socket.service";

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    private notificationArray=[];
    private realTimeArray = [];
    private notificationObject;
    showArray=[];
    ioConnection;
    unreadCount = 0;

    @ViewChild("navbar-cmp") button;

    constructor(location:Location, private renderer : Renderer, private element : ElementRef, private userService:UserService, private socketService: SocketService) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;

    }

    ngOnInit(){
        this.getNotification();
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        this.socketService.initSocket();
        this.ioConnection = this.socketService.onNewNotification().subscribe(
            (data)=>{
                this.showArray = [];
                this.unreadCount = 0;
                for (const key in data) {
                    const notif = data[key];
                    // //console.log(key);
                    // //console.log(notif);
                    let notification = {
                        "id":key,
                        "email":notif.email,
                        "message":notif.message,
                        "status":notif.status
                    };
                    console.log('real time',notification);

                    this.filterNotification(notification);


                }
            }
        );

    }

    comparer(otherArray){
        return function(current){
            return otherArray.filter(function(other){
                return other.email == current.email
            }).length == 0;
        }
    }



    getNotification(){
        this.userService.getNotication()
            .subscribe(data => {
                    // //console.log('IN RETURN COMPONENT Notification success',data) // Data which is returned by call
                    // //console.log('GET DATA',data);
                    this.showArray = [];
                    this.unreadCount = 0;
                    for (const key in data) {
                        const notif = data[key];
                        // //console.log(key);
                        // //console.log(notif);
                        let notification = {
                            "id":key,
                            "email":notif.email,
                            "message":notif.message,
                            "status":notif.status
                        };
                        this.filterNotification(notification);


                    }

                },
                error => { //console.log('IN RETURN COMPONENT error',error); // Error if any

                });
    }

    filterNotification(notification){
        // this.notificationArray=[];
        let loggedInUser = localStorage.getItem('currentUser');
        // //console.log(this.notificationArray);
       // //console.log('ARRAY IN SHOW NOTI',this.notificationArray);


            let e = notification;
            if(loggedInUser == e.email){
                ////console.log('Before push ',e);
                if(e.status=='Unread'){
                    this.unreadCount++;
                }


                this.showArray.push(e);
            }
            //console.log(this.showArray);

}

    deleteNotification(noti){
        ////console.log(noti);
        let data = {
            "id":noti.id
        };

        this.userService.postReadNoti(data)
            .subscribe(data => {
                    // //console.log('IN RETURN COMPONENT post noti success',data) // Data which is returned by call
                    this.unreadCount=0;
                    this.showArray=[];
                    this.getNotification();
                },
                error => { //console.log('IN RETURN COMPONENT post noti error',error); // Error if any

                });

    }
    crossNotification(noti){
        ////console.log(noti);
        let data = {
            "id":noti.id
        };

        this.userService.deleteNotification(data)
            .subscribe(data => { //console.log('IN RETURN COMPONENT DELETE noti success',data) // Data which is returned by call
                    this.unreadCount=0;
                    this.showArray=[];
                    this.getNotification();
                },
                error => { //console.log('IN RETURN COMPONENT post DELETE error',error); // Error if any

                });

    }



    getTitle(){
        var titlee = window.location.pathname;
        titlee = titlee.substring(1);
        for(var item = 0; item < this.listTitles.length; item++){
            if(this.listTitles[item].path === titlee){
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    logout(){
        //console.log('loggging out');
        localStorage.removeItem('currentUser');
    }

    sidebarToggle(){
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];

        if(this.sidebarVisible == false){
            setTimeout(function(){
                toggleButton.classList.add('toggled');
            },500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
}
