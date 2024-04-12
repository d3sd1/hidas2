import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './component/app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FlightViewComponent} from './component/flight-view/flight-view.component';
import {WeatherViewComponent} from './component/weather-view/weather-view.component';

@NgModule({
  declarations: [
    AppComponent,
    FlightViewComponent,
    WeatherViewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  exports: [

    BrowserModule,
    CommonModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
