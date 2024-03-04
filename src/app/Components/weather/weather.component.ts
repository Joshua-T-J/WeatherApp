import { Component } from '@angular/core';
import { WeatherService } from '../../Services/weather.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {

  weatherData: any;
  unit: string = 'metric';

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
        }
      })
    }
  }

  getWeatherIcon(iconCode: string) {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  }

  setUnit(unit: string) {
    this.unit = unit;
    this.getWeather();
  }
}
