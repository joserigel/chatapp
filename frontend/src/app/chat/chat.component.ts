import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, Message } from '../message.service';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Message[] = [];
  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const recipient = this.route.snapshot.paramMap.get('username');
    if (recipient) {
      this.messageService.getMessages(recipient).subscribe((data) => {
        console.log(data);
        this.messages = data;
      });
    }
  }
}
