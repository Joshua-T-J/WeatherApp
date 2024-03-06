import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
import { WeatherService } from '../../Services/weather.service';
import { CommonModule, DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-weather-details',
  standalone: true,
  imports: [
    JsonPipe,
    MatFormFieldModule,
    DatePipe,
    TitleCasePipe,
    MatExpansionModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './weather-details.component.html',
  styleUrl: './weather-details.component.css'
})
export class WeatherDetailsComponent implements OnInit {
  weatherDetails: any;
  weatherDetailsSorted: any = [];

  @ViewChild(MatAccordion) accordion!: MatAccordion;

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
        this.weatherDetailsSorted = this.groupByDate(res.list)
        console.log(this.weatherDetailsSorted)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.statusText)
      }
    });
  }

  timestampToDate(ts: number): string {
    const date = new Date(ts * 1000);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  groupByDate(data: any[]): any[] {
    const grouped = data.reduce((acc, obj) => {
      const date = this.timestampToDate(obj.dt);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(obj);
      return acc;
    }, {});

    // Convert the grouped object into an array
    const groupedArray = Object.keys(grouped).map(date => {
      return { date: date, data: grouped[date] };
    });

    return groupedArray;
  }

  getWeatherIcon(iconCode: string) {
    return `http://openweathermap.org/img/w/${iconCode}.png`;
  }


}
