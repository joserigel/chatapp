import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';

export interface Message {
  fromMe: boolean;
  text: string;
  unix: number;
}


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private urlGet: string = "/api/messages";
  private urlSend: string = "/api/send";
  
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  
  constructor(private http: HttpClient) { }

  getMessages(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.urlGet}/${username}`);
  }

  async sendMessage(username: string, text: string): Promise<void> {
    console.log(JSON.stringify({text}));
    const observable = this.http.post(`${this.urlSend}/${username}`,
      JSON.stringify({text}),
      this.httpOptions
    );

    await firstValueFrom(observable);
  }
}
