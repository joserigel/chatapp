import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


interface Token {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private url = "/api/login"
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(this.url,
      JSON.stringify({
        username, password
      }),
      this.httpOptions
    ).pipe(catchError((e) => {return of(e)}));
  }
}
