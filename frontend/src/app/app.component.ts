import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Hello World Angular App';
    message: string = 'Loading...';
    messages: any[] = [];
    newMessage: string = '';
    error: string = '';
    deleteConfirmId: number | null = null;
    backendStatus: string = 'Checking...';

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.checkBackendHealth();
        this.getHelloWorld();
        this.getAllMessages();
    }

    checkBackendHealth() {
        this.http.get<any>(`/api/health`).subscribe(
            data => {
                this.backendStatus = 'Connected';
                console.log('Backend health:', data);
            },
            error => {
                this.backendStatus = 'Disconnected';
                this.error = 'Cannot connect to backend server. Please make sure backend is running on port 8888';
                console.error('Backend health check failed:', error);
            }
        );
    }

    getHelloWorld() {
        this.http.get<any>(`/api/hello`).subscribe(
            data => {
                this.message = data.message;
                console.log('Message received:', data);
            },
            error => {
                console.error('Error:', error);
                this.message = 'Error connecting to backend!';
                this.error = 'Failed to fetch hello message. Backend might not be running.';
            }
        );
    }

    getAllMessages() {
        this.http.get<any[]>(`/api/messages`).subscribe(
            data => {
                this.messages = data;
                console.log('Messages loaded:', data);
            },
            error => {
                console.error('Error loading messages:', error);
                this.error = 'Failed to load messages from database.';
            }
        );
    }

    saveMessage() {
        if (this.newMessage.trim()) {
            this.http.post<any>(`/api/messages`, {content: this.newMessage})
                .subscribe(
                    data => {
                        this.messages.push(data);
                        this.newMessage = '';
                        this.error = '';
                    },
                    error => {
                        console.error('Error saving message:', error);
                        this.error = 'Failed to save message. Please try again.';
                    }
                );
        }
    }

    deleteMessage(id: number) {
        this.http.delete(`/api/messages/${id}`).subscribe(
            () => {
                // Remove message from array
                this.messages = this.messages.filter(msg => msg.id !== id);
                console.log(`Message with id ${id} deleted`);
            },
            error => {
                console.error('Error deleting message:', error);
                alert('Failed to delete message. Please try again.');
            }
        );
    }

    confirmDelete(id: number) {
        this.deleteConfirmId = id;
        setTimeout(() => {
            if (this.deleteConfirmId === id) {
                this.deleteConfirmId = null;
            }
        }, 3000); // Auto-cancel after 3 seconds
    }

    cancelDelete() {
        this.deleteConfirmId = null;
    }
}