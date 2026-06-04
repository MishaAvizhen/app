import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
    schedules: Schedule[] = [];
    isLoading: boolean = true;

    searchCity: string = '';
    searchStreet: string = '';
    searchBuilding: string = '';

    // Настройки пагинации
    currentPage: number = 1;
    pageSize: number = 2; // Количество карточек на одной странице
    totalPages: number = 1;

    private sub: Subscription;

    constructor(private scheduleService: ScheduleService) {}

    ngOnInit() {
        this.sub = this.scheduleService.getSchedules().subscribe(
            (data) => {
                this.schedules = data && data.schedules ? data.schedules : [];
                this.isLoading = false;
            },
            (err) => {
                console.error('Ошибка загрузки расписания', err);
                this.isLoading = false;
            }
        );
    }

    // Геттер, который возвращает ТОЛЬКО элементы для текущей страницы
    get pagedSchedules(): Schedule[] {
        const filtered = this.getFilteredSchedules();

        // Пересчитываем общее количество страниц на основе отфильтрованных данных
        this.totalPages = Math.ceil(filtered.length / this.pageSize) || 1;

        // Страхуемся, чтобы текущая страница не вылетела за рамки при фильтрации
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        return filtered.slice(startIndex, startIndex + this.pageSize);
    }

    // Переключение страниц
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Мягкий скролл наверх страницы
        }
    }

    // При любом вводе в поиск сбрасываем страницу на 1-ю
    onInputChange() {
        this.currentPage = 1;
    }

    clearAllFilters() {
        this.searchCity = '';
        this.searchStreet = '';
        this.searchBuilding = '';
        this.currentPage = 1;
    }

    // Базовый метод фильтрации
    getFilteredSchedules(): Schedule[] {
        const queryCity = this.searchCity.trim().toLowerCase();
        const queryStreet = this.searchStreet.trim().toLowerCase();
        const queryBuilding = this.searchBuilding.trim().toLowerCase();

        if (!queryCity && !queryStreet && !queryBuilding) {
            return this.schedules;
        }

        return this.schedules.filter(sc => {
            const matchesCity = !queryCity || (sc.city || '').toLowerCase().includes(queryCity);
            const matchesStreet = !queryStreet || (sc.street || '').toLowerCase().includes(queryStreet);
            const matchesBuilding = !queryBuilding || (sc.building || '').toLowerCase().includes(queryBuilding);
            return matchesCity && matchesStreet && matchesBuilding;
        });
    }

    // Динамические подсказки
    get citiesList(): string[] {
        const cities = new Set<string>();
        const currentStreet = this.searchStreet.trim().toLowerCase();
        this.schedules.forEach(sc => {
            if (!currentStreet || (sc.street || '').toLowerCase().includes(currentStreet)) {
                if (sc.city) cities.add(sc.city.trim());
            }
        });
        return Array.from(cities).sort();
    }

    get streetsList(): string[] {
        const streets = new Set<string>();
        const currentCity = this.searchCity.trim().toLowerCase();
        this.schedules.forEach(sc => {
            if (!currentCity || (sc.city || '').toLowerCase().includes(currentCity)) {
                if (sc.street) streets.add(sc.street.trim());
            }
        });
        return Array.from(streets).sort();
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
    }

    trackByAddress(index: number, item: Schedule): string {
        return item.city + item.street + item.building;
    }
    // Добавьте этот метод внутрь класса ScheduleComponent

    onPageSizeChange() {
        this.currentPage = 1; // Возвращаем на первую страницу
        // По желанию можно добавить плавный скролл наверх:
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

}
