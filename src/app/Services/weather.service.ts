import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  weatherUrl: string = 'https://api.openweathermap.org/data/2.5/forecast?q=';
  weatherUrlLatLong: string = 'https://api.openweathermap.org/data/3.0/onecall?'
  weatherUrlCity: string = 'https://api.openweathermap.org/data/2.5/weather?q='
  constructor(private http: HttpClient) { }

  getWeather(location: string, unit: string = 'metric'): Observable<any> {
    return this.http.get(
      this.weatherUrl + location + '&appid=' + environment.weatherApi.apiKey + '&units=' + unit
    );
  }

  getCityWeather(location: string, unit: string = 'metric'): Observable<any> {
    return this.http.get(
      this.weatherUrlCity + location + '&appid=' + environment.weatherApi.apiKey + '&units=' + unit
    );
  }

  getWeatherLoc(lat: string, long: string, unit: string = 'metric'): Observable<any> {
    return this.http.get(
      this.weatherUrl + 'lat=' + lat + '&lon=' + long + '&appid=' + environment.weatherApi.apiKey + '&units=' + unit
    );
  }
}
