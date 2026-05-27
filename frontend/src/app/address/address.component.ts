import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AddressService } from './address.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Импортируем HttpClient

@Component({
    selector: 'app-addresses',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css']
})

export class AddressComponent implements OnInit {
    city = '';
    street = '';
    houseNumber = '';

    results: any[] = [];
    currentPage = 0;
    totalPages = 0;
    pageSize = 5;

    citySuggestions: string[] = [];
    streetSuggestions: string[] = [];

    private cityInput$ = new Subject<string>();
    private streetInput$ = new Subject<string>();

    // Хранилище для графиков: "город_улица_дом" -> "график"
    private scheduleMap = new Map<string, string>();

    // Инжектируем HttpClient
    constructor(
        private addressService: AddressService,
        private eRef: ElementRef,
        private http: HttpClient
    ) {
        // Первичный поиск перенесен в ngOnInit после загрузки XML
    }

    ngOnInit() {
        // 1. Загружаем XML с графиками работы
        this.loadSchedulesFromXML();

        // 2. Подписки на подсказки
        this.cityInput$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(query => this.addressService.suggestCities(query))
        ).subscribe(list => this.citySuggestions = list);

        this.streetInput$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(query => this.addressService.suggestStreets(query, this.city))
        ).subscribe(list => this.streetSuggestions = list);
    }

    // Метод парсинга XML, адаптированный под синтаксис TS в Angular 8
    private loadSchedulesFromXML() {
        this.http.get('assets/schedule.xml', { responseType: 'text' }).subscribe(
            (xmlString: string) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                const addressNodes = xmlDoc.getElementsByTagName('address');

                for (let i = 0; i < addressNodes.length; i++) {
                    const node = addressNodes[i];

                    // Старый синтаксис проверки элементов без оператора ?.
                    const cityEl = node.getElementsByTagName('city')[0];
                    const streetEl = node.getElementsByTagName('street')[0];
                    const houseEl = node.getElementsByTagName('house')[0];
                    const workTimeEl = node.getElementsByTagName('workTime')[0];

                    const city = cityEl && cityEl.textContent ? cityEl.textContent.trim() : '';
                    const street = streetEl && streetEl.textContent ? streetEl.textContent.trim() : '';
                    const house = houseEl && houseEl.textContent ? houseEl.textContent.trim() : '';
                    const workTime = workTimeEl && workTimeEl.textContent ? workTimeEl.textContent.trim() : 'График не указан';

                    if (city && street && house) {
                        // Создаем уникальный текстовый ключ в нижнем регистре
                        const key = `${city.toLowerCase()}_${street.toLowerCase()}_${house.toLowerCase()}`;
                        this.scheduleMap.set(key, workTime);
                    }
                }
                // Запускаем поиск после успешного разбора XML
                this.onSearch(0);
            },
            (err) => {
                console.error('Ошибка загрузки XML с графиками:', err);
                // В случае ошибки все равно запускаем поиск, чтобы показать адреса без графика
                this.onSearch(0);
            }
        );
    }

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.clearSuggestions();
        }
    }

    clearSuggestions() {
        this.citySuggestions = [];
        this.streetSuggestions = [];
    }

    onCityInput(value: string) {
        this.city = value;
        if (value.length >= 2) this.cityInput$.next(value);
        else this.citySuggestions = [];
    }

    onStreetInput(value: string) {
        this.street = value;
        if (value.length >= 2) this.streetInput$.next(value);
        else this.streetSuggestions = [];
    }

    selectCity(selectedCity: string) {
        this.city = selectedCity;
        this.street = '';
        this.clearSuggestions();
        this.onSearch(0);
    }

    selectStreet(selectedStreet: string) {
        this.street = selectedStreet;
        this.clearSuggestions();
        this.onSearch(0);
    }

    onSearch(page: number = 0) {
        this.currentPage = page;
        this.addressService.search(this.city, this.street, this.houseNumber, this.currentPage, this.pageSize)
            .subscribe(pageData => {
                const content = pageData.content || [];
                // Маппинг данных с поиском по ключу в Map
                this.results = content.map((addr: any) => {
                    const c = addr.city ? addr.city.toLowerCase() : '';
                    const s = addr.street ? addr.street.toLowerCase() : '';
                    const h = addr.houseNumber ? addr.houseNumber.toLowerCase() : '';

                    const key = `${c}_${s}_${h}`;

                    return Object.assign({}, addr, {
                        schedule: this.scheduleMap.get(key) || 'График отсутствует'
                    });
                });
                this.totalPages = pageData.totalPages;
            });
    }

    clearCity() {
        this.city = '';
        this.citySuggestions = [];
        this.street = '';
        this.streetSuggestions = [];
        this.onSearch(0);
    }

    clearStreet() {
        this.street = '';
        this.streetSuggestions = [];
        this.onSearch(0);
    }
}
