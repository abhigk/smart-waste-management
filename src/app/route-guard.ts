import { CanActivate } from "@angular/router"

export class RouteGuard implements CanActivate{

    canActivate(){
        return false;
    }
    
}