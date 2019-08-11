export class User {
    private email: string;
    private name: string;
    private notifed: boolean;
    private password: string;
    private threshold: number;


    constructor(email:string,name:string,notifed:boolean, threshold: number){
        this.email = email;
        this.name = name;
        this.notifed = notifed;
        this.threshold = threshold;
    }

    getThreshold() {
        return this.threshold;
    }
    setThreshold(threshold:number){
        this.threshold = threshold;
    }

    getEmail(){
        return this.email;
    }

    getPassword(){
        return this.password;
    }

    getName(){
        return this.name;
    }

    getNotifed(){
        return this.notifed;
    }

    setNotifed(val){
        this.notifed = val;
    }
}