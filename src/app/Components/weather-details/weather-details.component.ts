import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
import { WeatherService } from '../../Services/weather.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-weather-details',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './weather-details.component.html',
  styleUrl: './weather-details.component.css'
})
export class WeatherDetailsComponent implements OnInit {
  weatherDetails: any;

  ngOnInit(): void {
    this.getWeatherDetails()
  }

  constructor(private weatherService: WeatherService, private route: ActivatedRoute) { }

  getWeatherDetails(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.weatherService.getWeather(params.get('id') as string, 'metric')
      }
      )
    ).subscribe({
      next: (res: any) => {
        console.log(res)
        this.weatherDetails = res;
      }
    });
  }

}
