import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Form, NgForm} from "@angular/forms";
import {AuthenticationService} from "./services/authentication.service";

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  logStatus:boolean = true;
  isSignUp:boolean = false;
  showAlert:boolean = false;
  msg:string;
  role:string;
  username;
  password;
  authenticationService:AuthenticationService;
  currentUser = null;
  constructor(auth:AuthService, authenticationService:AuthenticationService){
    this.logStatus = auth.getLogStatus();
    this.authenticationService = authenticationService;
  }



    ngOnInit(){
        this.currentUser = localStorage.getItem('currentUser');
        if(this.currentUser){
            this.logStatus = true;
        }else{
            this.logStatus = false;
        }
    };


    onSubmitLogin(form: NgForm){
       //this.logStatus = true;
        //console.log("Hello login");

        this.authenticationService.login(form.value.email,form.value.your_pass)
            .subscribe(data => { //console.log('IN RETURN COMPONENT success',data) // Data which is returned by call
                    let userEmail = form.value.email;
                    localStorage.setItem('currentUser', userEmail);
                    this.logStatus = true;
                    form.resetForm();
                },
                error => { //console.log('IN RETURN COMPONENT error',error); // Error if any
                    form.resetForm();
                    this.msg = 'Email or Password is incorrect';
                    this.role = 'danger';
                    this.showAlert  = true;
                });
           // this.authenticationService.test();
    }

    onSubmitSignUp(form: NgForm){


        //console.log("Hello signup");
        //console.log(form.value);

        this.authenticationService.signUp(form.value.name,form.value.email,form.value.your_pass)
            .subscribe(data => { //console.log('IN RETURN COMPONENT success',data); // Data which is returned by call
                    form.resetForm();
                    this.msg = 'SignUp Successful';
                    this.role = 'success';
                    this.showAlert  = true;
                    this.isSignUp = false;
                },
                error => { //console.log('IN RETURN COMPONENT error',error); // Error if any
                    form.resetForm();
                    this.msg = 'User Already Exist';
                    this.role = 'danger';
                    this.showAlert  = true;
            });

    };

    dismissAlert(){
        this.showAlert =false;
    }

    signUpSelected(){
      this.isSignUp = true;
    };

    logInSelected(){
      this.isSignUp = false;
    };
}
