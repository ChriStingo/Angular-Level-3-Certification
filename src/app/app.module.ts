import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import {LocationService} from "./location.service";
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import {WeatherService} from "./weather.service";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {routing} from "./app.routing";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TabPageComponent } from './widgets/tab-page/tab-page.component';
import { TabsComponent } from './widgets/tabs/tabs.component';
import { CachingInterceptor } from './caching-interceptor.service';

export const CACHE_DURATION_IN_SECONDS = new InjectionToken<number>('Cache duration in seconds');

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    TabPageComponent,
    TabsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    LocationService, 
    WeatherService, 
    { provide: CACHE_DURATION_IN_SECONDS, useValue: 2 * 60 * 60 },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
