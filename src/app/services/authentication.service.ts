import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        })
    };

    login(email: string, password: string) {
        //console.log('IN LOGIN');
        // //console.log(email,password);


        return this.http.post("/api/login",{
            "email": email,
            "password": password
        },this.httpOptions)
            .pipe(map((response: Response) => response));




        // this.http.post("https://bindata-app.herokuapp.com/api/login",
        //     {
        //         "email": email,
        //         "password": password
        //     },this.httpOptions)
        //     .subscribe(
        //         data => {
        //             //console.log("POST Request is successful ", data);
        //             localStorage.setItem('currentUser', 'active');
        //         },
        //         error => {
        //             //console.log("Error", error);
        //         }
        //     );





        // return this.http.post<any>(`https://bindata-app.herokuapp.com/api/login`, { email: email, password: password })
        //     .pipe(map(user => {
        //         // login successful if there's a jwt token in the response
        //         //console.log('SUCCESS');
        //         if (user && user.token) {
        //             // store user details and jwt token in local storage to keep user logged in between page refreshes
        //             localStorage.setItem('currentUser', JSON.stringify(user));
        //         }
        //
        //         return user;
        //     }));
    }

    logout() {
        // remove user from local storage to log user out
        //console.log('loggging out');
        localStorage.removeItem('currentUser');
    }

    signUp(name:string,email: string, password: string){

        //console.log('IN SIGNUP');

        return this.http.post("/api/signUp",{
            "name":name,
            "email": email,
            "password": password
        },this.httpOptions)
            .pipe(map((response: Response) => response));

        // this.http.post("https://bindata-app.herokuapp.com/api/signUp",
        //     {
        //         "name":name,
        //         "email": email,
        //         "password": password
        //     },this.httpOptions)
        //     .subscribe(
        //         data => {
        //             //console.log("POST Request is successful ", data);
        //
        //         },
        //         error => {
        //             //console.log("Error", error);
        //         }
        //     );

    }

}