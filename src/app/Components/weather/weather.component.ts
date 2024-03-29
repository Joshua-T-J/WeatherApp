import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WeatherService } from '../../Services/weather.service';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink, MatTooltipModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css',
})
export class WeatherComponent {
  weatherData: any;
  unit: string = 'metric';
  date: Date = new Date();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private weatherService: WeatherService,
    private fb: FormBuilder
  ) {
    this.getLocalStorageValue();
    this.weatherUnit.valueChanges.subscribe((value) => {
      this.setUnit(value);
    });
  }

  weatherUnit = new FormControl(false);

  formWeather = this.fb.nonNullable.group({
    Location: ['', Validators.required],
  });

  getLocalStorageValue() {
    if (isPlatformBrowser(this.platformId)) {
      let unit = localStorage.getItem('unit');
      let booleanUnit = unit === 'true';
      this.unit = booleanUnit ? 'imperial' : 'metric';
      this.weatherUnit.setValue(booleanUnit);
    }
  }

  getWeather() {
    if (this.formWeather.valid) {
      this.weatherService
        .getCityWeather(this.formWeather.controls.Location.value, this.unit)
        .subscribe({
          next: (res) => {
            // console.log(res);
            this.weatherData = res;
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 404) {
              alert(error.error?.message);
            }
          },
        });
    }
  }

  getWeatherIcon(iconCode: string) {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  }

  setUnit(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('unit', event);
    }
    this.unit = event ? 'imperial' : 'metric';
    this.getWeather();
  }
}
