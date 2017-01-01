import {Injectable}     from "@angular/core";
import {CanActivate, Router}    from "@angular/router";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {isLoggedUrl} from "../constant";

@Injectable()
export class AuthAdminGuard implements CanActivate {

    constructor(private router: Router,
                private http: Http) {
    }

    canActivate(): Observable<boolean> {
        return this.checkLogin();
    }

    checkLogin(): Observable<boolean> {
        return Observable.create(observer=> {
            this.http
                .get(isLoggedUrl)
                .map((response: Response) => response.json())
                .subscribe((response: any) => {
                    if (response.roles && response.roles[1] === "admin") {
                        observer.next(true)
                    } else {
                        this.router.navigate(["/notfound"]);
                        observer.next(false);
                    }
                });
        });
    }
}