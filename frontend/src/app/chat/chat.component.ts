import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Message } from '../message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Message[] = [];
  messageInput: string = '';
  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    const recipient = this.route.snapshot.paramMap.get('username');
    if (recipient) {
      this.messageService.getMessages(recipient).subscribe({
        next: (data) => {
          this.messages = data;
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            const error = err as HttpErrorResponse;
            if (error.status === 401) {
              this.router.navigate(['/login'])
            }
          }
        }
      });
    }
  }

  sendMessage() {
    const recipient = this.route.snapshot.paramMap.get('username');

    if (recipient) {
      const promise = this.messageService.sendMessage(recipient, this.messageInput);
      promise.then(() => {
        window.location.reload();
      });
    }
  }
}
