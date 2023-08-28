import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

interface seriesData {
  y: number;
  color: Highcharts.GradientColorObject;
}

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GaugeComponent implements OnInit {
  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {};
  public colors = ['#00AA6C', '#61B897', '#175F45', '#A0CABB', '#E9E9E9'];
  public data: [string, number][] = [
    ['Boiler level', 100],
    ['Load demand burner', 80],
    ['Actuating FC', 66],
    ['Flame signal', 58],
    ['0<sub>2</sub> value', 42],
  ];
  public gradient = {
    x1: 1.7,
    y1: 0,
    x2: 0,
    y2: 1,
  };

  public createCategories(data: [string, number][] | null): string[] {
    if (!data) return [];

    return [
      ...data.map(
        ([name, percent], index) =>
          `${name}<span style="position: absolute; scale: 0.9; right: -22px; color: ${
            this.colors[index] ? this.colors[index] : ''
          }">&#9658;</span>`
      ),
      '',
      '',
    ];
  }

  public generateGradient(colors: string[]): Highcharts.GradientColorObject[] {
    return colors.map(
      (color) =>
        ({
          linearGradient: this.gradient,
          stops: [
            [0, '#000'],
            [1, color],
          ],
        } as Highcharts.GradientColorObject)
    );
  }

  public createData(arr: [string, number][] | null): seriesData[] {
    const placeholder: seriesData[] = [
      {
        y: 0,
        color: {
          linearGradient: this.gradient,
          stops: [
            [0, '#000'],
            [1, 'red'],
          ],
        },
      },
      {
        y: 0,
        color: {
          linearGradient: this.gradient,
          stops: [
            [0, '#000'],
            [1, 'plum'],
          ],
        },
      },
    ];

    if (!arr) return placeholder;

    const gradientColorObjects: Highcharts.GradientColorObject[] =
      this.generateGradient(this.colors);
    const mappedArray: seriesData[] = arr.map(
      ([name, percent], index): seriesData => ({
        y: percent,
        color: gradientColorObjects[index],
      })
    );

    mappedArray.push(...placeholder);

    return mappedArray;
  }

  public setColors(e: Event): void {
    if (e.target instanceof Highcharts.Chart) {
      e.target['series'][0]['points'].forEach((hcPoint, index) => {
        if (!e.target) return;

        console.log(this.colors[index]);
        hcPoint['dataLabel'].element.firstElementChild.style.fill = this.colors[
          index
        ]
          ? this.colors[index]
          : '';

        // preventing the color drop of the tspan tag inside the text after Ctrl + Mouse Wheel Up/Down
        hcPoint[
          'dataLabel'
        ].element.firstElementChild.firstElementChild.style.fill = '#000000';
        hcPoint[
          'dataLabel'
        ].element.firstElementChild.firstElementChild.style.stroke = '#000000';
        // dataLabel.element.firstElementChild.style.fill = hcPoint['color']; // gradient version
      });
    }
  }

  public setChartOptions(): void {
    this.chartOptions = {
      colors: this.generateGradient(this.colors),
      chart: {
        backgroundColor: '#1C242E',
        borderRadius: 10,
        events: {
          load: (e: Event) => {
            this.setColors(e);
          },
          redraw: (e: Event) => {
            this.setColors(e);
          },
        },
        inverted: true,
        polar: true,
        type: 'column',
      },
      title: {
        align: 'left',
        style: {
          fontSize: '12',
          color: '#D9D9D9',
        },
        text: 'Boiler Data (%)',
        x: 8,
        y: 15,
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        outside: true,
      },
      pane: {
        size: '90%',
        endAngle: 225,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        tickInterval: 1,
        labels: {
          align: 'right',
          useHTML: true,
          allowOverlap: true,
          step: 1,
          y: 6,
          x: -25,
          style: {
            fontSize: '13px',
            color: '#D9D9D9',
          },
        },
        lineWidth: 0,
        categories: this.createCategories(this.data),
        gridLineColor: '#34363B',
      },
      yAxis: {
        lineWidth: 0,
        tickInterval: 20,
        reversedStacks: false,
        endOnTick: true,
        showLastLabel: true,
        gridLineColor: '#34363B',
        labels: {
          distance: 12,
          allowOverlap: true,
          align: 'center',
          style: {
            color: '#404041',
            fontWeight: 'bold',
            fontFamily: 'Roboto Mono',
          },
        },
        color: '#424142',
        left: 11,
        accessibility: {
          description: 'Percent',
        },
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          pointPadding: 0,
          groupPadding: 0.3,
          borderRadius: 8,
          tooltip: { valueSuffix: '%' },
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              fontFamily: 'Roboto Mono',
            },
          },
        },
        series: {
          shadow: {
            color: '#000',
            width: 2,
            opacity: 0.3,
            offsetX: 0,
            offsetY: 0,
          },
        },
      },
      series: [
        {
          name: 'Percent',
          data: this.createData(this.data),
        },
      ] as Highcharts.SeriesOptionsType[],
    };
  }

  public ngOnInit(): void {
    this.setChartOptions();
  }
}
