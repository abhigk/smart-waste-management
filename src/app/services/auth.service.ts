export class AuthService {
    private logSatus = false;

    getLogStatus():boolean {
        return this.logSatus;
    }

    setLogStatus(status:boolean){
            this.logSatus = status;
    }

    logIn(){
        this.logSatus = true;
    }

    logOut(){
        this.logSatus = false;
    }

}