import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Message {
  sender: string;
  recipient: string;
  text: string;
  unix: number;
}


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private url: string = "/api/";
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  
  constructor() { }
}
