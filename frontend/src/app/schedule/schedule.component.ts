import {Component, OnDestroy, OnInit} from '@angular/core';
import {ScheduleService} from './schedule.service';
import {Schedule} from './schedule.model';
import {Subscription} from 'rxjs';
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.css'],
    animations: [
        trigger('cardAnimation', [
            // Переход срабатывает при изменении количества элементов (фильтрация или смена страницы)
            transition('* => *', [
                // Скрываем новые элементы до начала анимации
                query(':enter', [
                    style({ opacity: 0, transform: 'translateY(15px)' })
                ], { optional: true }),

                // Эффект плавного "появления по очереди" (stagger) для карточек
                query(':enter', [
                    stagger('60ms', [
                        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})
export class ScheduleComponent implements OnInit, OnDestroy {
    schedules: Schedule[] = [];
    filteredSchedules: Schedule[] = []; // Промежуточный массив отфильтрованных данных
    pagedSchedules: Schedule[] = [];    // Хранит физический массив для текущей страницы

    // Динамические списки для автокомплита
    citiesList: string[] = [];
    streetsList: string[] = [];

    isLoading: boolean = true;

    searchCity: string = '';
    searchStreet: string = '';
    searchBuilding: string = '';

    // Настройки пагинации
    currentPage: number = 1;
    pageSize: number = 2;
    totalPages: number = 1;

    private sub: Subscription;

    constructor(private scheduleService: ScheduleService) {
    }

    ngOnInit() {
        this.sub = this.scheduleService.getSchedules().subscribe(
            (data) => {
                this.schedules = data && data.schedules ? data.schedules : [];
                this.isLoading = false;
                // Инициализируем цепочку обработки данных
                this.updateAllData();
            },
            (err) => {
                console.error('Ошибка загрузки расписания', err);
                this.isLoading = false;
            }
        );
    }

    // Главный метод управления потоком данных
    private updateAllData() {
        this.applyFilter();
        this.updateDatalists();
        this.updatePage();
    }

    // 1. Фильтрация в ЛЮБОЙ последовательности
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

    // 2. Генерация динамических подсказок в зависимости от ввода
    private updateDatalists() {
        const cities = new Set<string>();
        const streets = new Set<string>();

        const currentCity = this.searchCity.trim().toLowerCase();
        const currentStreet = this.searchStreet.trim().toLowerCase();

        this.schedules.forEach(sc => {
            // Подсказки городов сужаются, если введена улица
            if (!currentStreet || (sc.street || '').toLowerCase().includes(currentStreet)) {
                if (sc.city) cities.add(sc.city.trim());
            }
            // Подсказки улиц сужаются, если введен город
            if (!currentCity || (sc.city || '').toLowerCase().includes(currentCity)) {
                if (sc.street) streets.add(sc.street.trim());
            }
        });

        this.citiesList = Array.from(cities).sort();
        this.streetsList = Array.from(streets).sort();
    }

    // 3. Расчет страниц и нарезка массива (Срабатывает триггер анимации)
    private updatePage() {
        this.totalPages = Math.ceil(this.filteredSchedules.length / this.pageSize) || 1;

        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;

        // Создаем новую ссылку на кусок массива. Это стриггерит [@cardAnimation] в HTML
        this.pagedSchedules = this.filteredSchedules.slice(startIndex, startIndex + this.pageSize);
    }

    // Переключение страниц кнопочками Назад/Вперед
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePage();
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    // При изменении любого инпута
    onInputChange() {
        this.currentPage = 1;
        this.updateAllData();
    }

    // Изменение количества элементов на странице
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
