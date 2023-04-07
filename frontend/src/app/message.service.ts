import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

export interface Message {
  fromMe: boolean;
  text: string;
  unix: number;
}


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url: string = "/api/messages";
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  
  constructor(private http: HttpClient) { }

  getMessages(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}/${username}`);
  }
}
