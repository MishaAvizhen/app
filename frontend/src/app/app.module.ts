import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {MessageFormComponent} from "./message-form.component";
import {MessageListComponent} from "./message-list.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        AppComponent,
        MessageListComponent,
        MessageFormComponent
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
export class AppModule { }