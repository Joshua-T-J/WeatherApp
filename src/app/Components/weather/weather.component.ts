import { Component } from '@angular/core';
import { WeatherService } from '../../Services/weather.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink, MatTooltipModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {

  weatherData: any;
  unit: string = 'metric';
  date: Date = new Date();

  constructor(private weatherService: WeatherService, private fb: FormBuilder) { }

  formWeather = this.fb.group({
    Location: ['', Validators.required]
  })

  getWeather() {
    if (this.formWeather.valid) {
      this.weatherService.getCityWeather(this.formWeather.controls.Location.value || '', this.unit).subscribe({
        next: (res) => {
          console.log(res)
          this.weatherData = res;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            alert(error.error?.message)
          }
        }
      })
    }
  }

  getWeatherIcon(iconCode: string) {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  }

  setUnit(event: any) {
    if (event) {
      this.unit = event.target.checked ? 'imperial' : 'metric';
    }
    this.getWeather();
  }

}
