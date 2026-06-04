import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchedulesResponse } from './schedule.model';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = '/api/reports/schedule-json'; // URL вашего Spring-бэкенда

    constructor(private http: HttpClient) {}

    getSchedules(): Observable<SchedulesResponse> {
        return this.http.get<SchedulesResponse>(this.apiUrl);
    }
}

