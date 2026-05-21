import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressService {
    private baseUrl = '/api/addresses';
    constructor(private http: HttpClient) {}
    // Поиск возвращает объект Spring Page (с контентом и метаданными)
    search(city: string, street: string, houseNumber: string, page: number, size: number): Observable<any> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (city) params = params.append('city', city);
        if (street) params = params.append('street', street);
        if (houseNumber) params = params.append('houseNumber', houseNumber);

        return this.http.get<any>(`${this.baseUrl}/search`, { params });
    }

    // Запрос для автодополнения
    suggestCities(query: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/autocomplete/city`, {
            params: new HttpParams().set('query', query)
        });
    }
    suggestStreets(query: string, city: string): Observable<string[]> {
        let params = new HttpParams().set('query', query);
        if (city) params = params.append('city', city);

        return this.http.get<string[]>(`${this.baseUrl}/autocomplete/street`, { params });
    }

}
