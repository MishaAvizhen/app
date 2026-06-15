import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

import {ScheduleComponent} from "./schedule/schedule.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {HomeComponent} from "./home/home.component";



@NgModule({
    declarations: [
        AppComponent,
        ScheduleComponent,
        ContactsComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,  // This is correct for Angular 8
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}