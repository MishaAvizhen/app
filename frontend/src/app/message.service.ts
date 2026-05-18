import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from "./message.model";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = '/api/messages';

    constructor(private http: HttpClient) { }

    getAllMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(this.apiUrl);
    }

    createMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(this.apiUrl, message);
    }

    deleteMessage(id: number): Observable<any> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}