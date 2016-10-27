import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import {User} from "../classes/user";
import {loginUrl} from "../constants";
import {logoutUrl} from "../constants";

@Injectable()
export class LoginService {

    private loginUrl:string = loginUrl;
    private logoutUrl:string = logoutUrl;

    private _headers = new Headers({"content-type": "application/json"});

    constructor(private _router:Router,
                private _http:Http) {
    };

    private handleError = (error:any):Observable<any>=> {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    };

    private success = (response:Response)=>response.json();

    private successLogout = (response:Response)=> {
        if (response.status == 200) {
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("userId");
            this._router.navigate(["/login"]);
        } else {
            console.log("User has not been logout")
        }
    };

    login(user:User):Observable<any> {
        return this._http
            .post(this.loginUrl, JSON.stringify(user), {headers: this._headers})
            .map(this.success)
            .catch(this.handleError)
    };

    logout():void {
        this._http
            .get(this.logoutUrl)
            .subscribe(this.successLogout);
    }

}
