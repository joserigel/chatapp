import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


interface Token {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private username: string = '';

  private url = "/api/login";
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  constructor(
    private http: HttpClient,
    private cookieService: CookieService) { }

  async login(username: string, password: string): Promise<boolean> {
    const observable = this.http.post<Token>(this.url,
      JSON.stringify({
        username, password
      }),
      this.httpOptions
    ).pipe(catchError((e) => {return of(e)}));

    const {token} = await firstValueFrom(observable);
    if (token) {
      this.username = username;
      this.cookieService.set('token', token);
      return true;
    } else {
      this.username = '';
      return false;
    }
  }

  /*
  login(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(this.url,
      JSON.stringify({
        username, password
      }),
      this.httpOptions
    ).pipe(catchError((e) => {return of(e)}));
  }
  */
}
