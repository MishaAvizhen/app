import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import { AddressService } from './address.service';
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

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

    // Инжектируем ElementRef для доступа к DOM-элементу компонента
    constructor(private addressService: AddressService, private eRef: ElementRef) {
        this.onSearch();
    }

    ngOnInit() {
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

    // Глобальный слушатель кликов по всему документу
    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        // Если клик был совершен ВНЕ нашего компонента (формы поиска), очищаем подсказки
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.clearSuggestions();
        }
    }

    // Метод для очистки списков подсказок
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
        this.clearSuggestions(); // Скрываем все списки после выбора
        this.onSearch(0);
    }

    selectStreet(selectedStreet: string) {
        this.street = selectedStreet;
        this.clearSuggestions(); // Скрываем все списки после выбора
        this.onSearch(0);
    }

    onSearch(page: number = 0) {
        this.currentPage = page;
        this.addressService.search(this.city, this.street, this.houseNumber, this.currentPage, this.pageSize)
            .subscribe(pageData => {
                this.results = pageData.content;
                this.totalPages = pageData.totalPages;
            });
    }

    // Очистка поля Город
    clearCity() {
        this.city = '';
        this.citySuggestions = [];
        this.street = ''; // Т.к. улица привязана к городу, её логично тоже сбросить
        this.streetSuggestions = [];
        this.onSearch(0); // Перезапускаем глобальный поиск с первой страницы
    }

// Очистка поля Улица
    clearStreet() {
        this.street = '';
        this.streetSuggestions = [];
        this.onSearch(0); // Перезапускаем глобальный поиск с первой страницы
    }
}
