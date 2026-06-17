import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    ngOnInit(): void {

    }

    setActive(linkElement: HTMLElement, targetId: string) {
        // 1. Плавный скролл к секции
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }

        // 2. Сброс активного класса у всех ссылок в навигации
        // Находим родителя и убираем класс active у его детей
        const parent = linkElement.parentElement;
        if (parent) {
            const links = parent.querySelectorAll('.nav-link');
            links.forEach(link => link.classList.remove('active'));
        }

        // 3. Добавляем класс active той ссылке, на которую кликнули
        linkElement.classList.add('active');
    }

}