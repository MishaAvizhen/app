import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Message} from "./message.model";
import {MessageService} from "./message.service";


@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html'
})
export class MessageListComponent {
    @Input() messages: Message[] = [];
    @Output() messageCreated = new EventEmitter<void>();

    constructor(private messageService: MessageService) {}

    onDeleteMessage(id: number) {

        if (confirm('Are you sure you want to delete this message?')) {

            this.messageService.deleteMessage(id).subscribe(
                (next) => this.messages = next,
                error => alert('Failed to delete message')
            );
        }
    }
}