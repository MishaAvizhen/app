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
        // 1. Плавный скролл к нужной секции
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }

        // 2. Полностью сбрасываем класс active у всех ссылок
        const allLinks = document.querySelectorAll('.nav-link, .nav-link-anchor');
        allLinks.forEach(link => link.classList.remove('active'));

        // 3. Проверяем, куда кликнули
        if (linkElement.classList.contains('nav-link-anchor')) {
            // Если клик по логотипу: находим в меню ссылку "Главная" по ее href и подсвечиваем
            const homeLink = document.querySelector('a[href="#home"].nav-link');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        } else {
            // Если клик по обычному пункту меню: подсвечиваем именно его
            linkElement.classList.add('active');
        }
    }


}