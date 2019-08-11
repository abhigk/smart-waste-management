import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit{
    public tableData1: TableData;
    public tableData2: TableData;

    public userAry:User[] = [];

    public superArray:any[] = [];

    public notifyArray;
    public msg:string;
    public editMode:boolean = false;
    notifySent:boolean = false;

    listOfNotifiedUsers= [];

    constructor(private userService: UserService){

    }

    getUser(email) {
        for (let i = 0; i < this.userAry.length ; i++) {
            ////console.log('matching',this.userAry[i].getEmail(),'with',email.email);
            if (this.userAry[i].getEmail() === email) {
                ////console.log(this.userAry[i]);
                return this.userAry[i];
            }
        }
    }

    ngOnInit(){
        this.getData();
        this.tableData1 = {
            headerRow: [ 'Select', 'Name', 'Email', 'isNotified'],
            dataRows: this.superArray
        };



    }

    getData(){
        this.userService.getUserData().then((userData: User[])=>{
            // console.log('USER DATA ---->> ',userData);
            this.userAry = userData;

            //console.log('USER DATA',this.userAry);
            this.userService.getNotifiedUsers().subscribe((data: Object) => {
                ////console.log(data);
                for( let key in data) {

                    const email = data[key];
                    /////console.log('mf',email);
                    let threshold = +email.threshold;
                    console.log('Threshold',threshold);
                    //set default threshold value
                    if(threshold == null) {
                        threshold = 80;
                    }
                    const user = this.getUser(email.email);
                    console.log('USER',user);

                    user.setNotifed(true);
                    user.setThreshold(threshold);

                }
                ////console.log('GETTING DATA',this.userAry);
            });


        });
    }



    handleChange(data){
        //console.log('DATA',data);
        // let temp = {email:data.email};
        if(data.notifed){
            data.setNotifed(false);
            //this.notifyArray.push(data);
        }else{
            data.setNotifed(true);
            //this.notifyArray.push(data);
        }

        // //console.log(this.userAry);
        // this.notifyArray = this.userAry;
        //
        // if(data.notifed == true){
        //     //console.log("in true that removing");
        //     this.notifyArray = this.notifyArray.filter(function (orgData) {
        //        return orgData.email != data.email;
        //     });
        // }else{
        //     //console.log("in false that adding");
        //     this.notifyArray.push(data);
        // }
        //
        // //console.log('change data',this.notifyArray);
    }

    enableEdit(){
        this.editMode = true;
    }

    random(){
        return '_' + Math.random().toString(36).substr(2,9);
    }

    sendNotification(){
        // if(this.editMode) {
        //     this.editMode = false;
        //
        // }
        this.notifyArray = {};

        //console.log("Here is data of users to be notified");

        for (let i = 0; i < this.userAry.length ; i++) {
            if(this.userAry[i].getNotifed()==true){
                // //console.log('THIS-->',this.userAry[i]);
                // this.notifyArray.push(this.userAry[i]);
                if(!this.userAry[i].getThreshold()){
                    this.userAry[i].setThreshold(0)
                }

                var test = {
                    email:this.userAry[i].getEmail(),
                    name:this.userAry[i].getName(),
                    notified:this.userAry[i].getNotifed(),
                    threshold:this.userAry[i].getThreshold()
                };
                var key = this.random();

                this.notifyArray[key] = test;
            }
        }





        console.log('USER ARY SENDING',this.notifyArray);


        //switch on
        this.userService.postUserEmail(this.notifyArray)
            .subscribe(data => { //console.log('IN RETURN COMPONENT success',data) // Data which is returned by call
                    this.notifyArray = [];
                    this.editMode = false;
                    this.msg = 'User are updated successfully';
                    this.notifySent = true;
                    this.getData();
                },
                error => { //console.log('IN RETURN COMPONENT error',error); // Error if any
                    //console.log("ERROR USER ARRAY");
                });

    }

    dismissAlert(){
        this.notifySent =false;
    }


}
