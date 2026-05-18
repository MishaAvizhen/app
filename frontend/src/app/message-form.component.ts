// import { Component, Output, EventEmitter } from '@angular/core';
// import {MessageService} from "./message.service";
//
//
// @Component({
//     selector: 'app-message-form',
//     templateUrl: './message-form.component.html'
//
// })
// export class MessageFormComponent {
//     newMessage: string = '';
//     @Output() messageCreated = new EventEmitter<void>();
//
//     constructor(private messageService: MessageService) {}
//
//     onSubmit() {
//         if (this.newMessage.trim()) {
//             this.messageService.createMessage({ content: this.newMessage }).subscribe(
//                 () => {
//                     this.newMessage = '';
//                     this.messageCreated.emit();
//                 },
//                 error => console.error('Error creating message', error)
//             );
//         }
//     }
//
// }