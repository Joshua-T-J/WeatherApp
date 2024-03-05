import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs';
import { WeatherService } from '../../Services/weather.service';
import { CommonModule, DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-weather-details',
  standalone: true,
  imports: [
    JsonPipe,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    DatePipe,
    TitleCasePipe,
    MatExpansionModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './weather-details.component.html',
  styleUrl: './weather-details.component.css'
})
export class WeatherDetailsComponent implements OnInit {
  weatherDetails: any;
  weatherDetailsSorted: any = [];
  displayedColumns: string[] = ['No', 'date', 'temperature', 'icon', 'description'];
  expandedElement: any | null;
  dataSource = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.weatherDetailsSorted, 'expand'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.getWeatherDetails()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
        // this.dataSource = new MatTableDataSource(this.weatherDetails.list)
        this.dataSource = new MatTableDataSource(this.weatherDetailsSorted)
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
