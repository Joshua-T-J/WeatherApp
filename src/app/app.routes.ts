import { Routes } from '@angular/router';
import { WeatherComponent } from './Components/weather/weather.component';
import { WeatherDetailsComponent } from './Components/weather-details/weather-details.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '', component: WeatherComponent },
    { path: 'details/:id', component: WeatherDetailsComponent },
    { path: '**', component: PageNotFoundComponent }
];
