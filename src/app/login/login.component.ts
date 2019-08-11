import { Component, OnInit } from '@angular/core';
import {Form} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private router:ActivatedRoute;

  constructor(auth:AuthService,r:ActivatedRoute) {
    this.router = r;

  }

  ngOnInit() {
  }

  onSubmit(form: Form){

    //console.log("Hello");
    //console.log(form);

  }

}
