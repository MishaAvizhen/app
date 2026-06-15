import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.model';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css']

})
export class ScheduleComponent implements OnInit, OnDestroy {
    schedules: Schedule[] = [];
    filteredSchedules: Schedule[] = [];
    pagedSchedules: Schedule[] = [];

    citiesList: string[] = [];
    streetsList: string[] = [];

    isLoading: boolean = true;

    searchCity: string = '';
    searchStreet: string = '';
    searchBuilding: string = '';

    currentPage: number = 1;
    pageSize: number = 2;
    totalPages: number = 1;

    private sub: Subscription;
    url: SafeResourceUrl;

    // ИСПРАВЛЕНО: Объединили два конструктора в один легитимный
    constructor(
        private scheduleService: ScheduleService,
        private sanitizer: DomSanitizer
    ) {
        // ИСПРАВЛЕНО: Указали чистый адрес виджета Яндекса для Бядули 12 без CSP-блокировок
        const url ="https://yandex.ru/map-widget/v1/?text=Минск%20улица%20Змитрока%20Бядули%2012&z=17&l=map&pt=27.566100,53.910200~pm2blm";
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    }

    ngOnInit() {
        this.sub = this.scheduleService.getSchedules().subscribe(
            (data) => {
                this.schedules = data && data.schedules ? data.schedules : [];
                this.isLoading = false;
                this.updateAllData();
            },
            (err) => {
                console.error('Ошибка загрузки расписания', err);
                this.isLoading = false;
            }
        );
    }

    private updateAllData() {
        this.applyFilter();
        this.updateDatalists();
        this.updatePage();
    }

    private applyFilter() {
        const queryCity = this.searchCity.trim().toLowerCase();
        const queryStreet = this.searchStreet.trim().toLowerCase();
        const queryBuilding = this.searchBuilding.trim().toLowerCase();

        if (!queryCity && !queryStreet && !queryBuilding) {
            this.filteredSchedules = [...this.schedules];
            return;
        }

        this.filteredSchedules = this.schedules.filter(sc => {
            const matchesCity = !queryCity || (sc.city || '').toLowerCase().includes(queryCity);
            const matchesStreet = !queryStreet || (sc.street || '').toLowerCase().includes(queryStreet);
            const matchesBuilding = !queryBuilding || (sc.building || '').toLowerCase().includes(queryBuilding);
            return matchesCity && matchesStreet && matchesBuilding;
        });
    }

    private updateDatalists() {
        const cities = new Set<string>();
        const streets = new Set<string>();

        const currentCity = this.searchCity.trim().toLowerCase();
        const currentStreet = this.searchStreet.trim().toLowerCase();

        this.schedules.forEach(sc => {
            if (!currentStreet || (sc.street || '').toLowerCase().includes(currentStreet)) {
                if (sc.city) cities.add(sc.city.trim());
            }
            if (!currentCity || (sc.city || '').toLowerCase().includes(currentCity)) {
                if (sc.street) streets.add(sc.street.trim());
            }
        });

        this.citiesList = Array.from(cities).sort();
        this.streetsList = Array.from(streets).sort();
    }

    private updatePage() {
        this.totalPages = Math.ceil(this.filteredSchedules.length / this.pageSize) || 1;

        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.pagedSchedules = this.filteredSchedules.slice(startIndex, startIndex + this.pageSize);
    }

    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePage();
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    onInputChange() {
        this.currentPage = 1;
        this.updateAllData();
    }

    onPageSizeChange() {
        this.currentPage = 1;
        this.updatePage();
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    clearAllFilters() {
        this.searchCity = '';
        this.searchStreet = '';
        this.searchBuilding = '';
        this.currentPage = 1;
        this.updateAllData();
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
    }

    trackByAddress(index: number, item: Schedule): string {
        return `${item.city}-${item.street}-${item.building}`;
    }
}