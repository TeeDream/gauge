import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

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
    x1: 0, //right to left [red, color] red -> color
    y1: 0, //bottom to top [red, color] red -> color
    x2: 1, //left to right [red, color] red -> color
    y2: 0, //top to bottom [red, color] red -> color
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
      '', // additional row for empty space inside the circle, requires 0 as data value
      '', // additional row for empty space inside the circle, requires 0 as data value
    ];
  }

  public generateGradient(colors: string[]): Highcharts.GradientColorObject[] {
    return colors.map(
      (color) =>
        ({
          linearGradient: this.gradient,
          stops: [
            [0, '#a15'],
            [1, color],
          ],
        } as Highcharts.GradientColorObject)
    );
  }

  public createData(arr: [string, number][] | null) {
    if (!arr) return [];

    return arr.map(([name, percent], index) => {
      // dataArr signature [0, 0,..., row value(percent), 0,0 <- "two last values" for empty rows]
      const dataArr = new Array(arr.length + 2).fill(0);
      dataArr[index] = percent;

      return {
        name,
        data: dataArr,
      };
    });
  }

  public setChartOptions(): void {
    this.chartOptions = {
      colors: this.generateGradient(this.colors),
      chart: {
        type: 'column',
        inverted: true,
        polar: true,
        backgroundColor: '#1C242E',
        borderRadius: 10,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: 'Boiler Data (%)',
        align: 'left',
        style: {
          fontSize: '12',
          color: '#D9D9D9',
        },
        y: 15,
        x: 8,
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
          y: 3,
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
          align: 'center',
          style: {
            color: '#404041',
            fontWeight: 'bold',
            fontFamily: 'Roboto Mono',
          },
        },
        color: '#424142',
        left: 11,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderWidth: 0,
          pointPadding: 0,
          groupPadding: 0.3,
          borderRadius: 8,
          tooltip: { valueSuffix: '%' },
          dataLabels: {
            enabled: true, // shows labels inside the arch
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
      series: this.createData(this.data) as Highcharts.SeriesOptionsType[],
    };
  }

  public ngOnInit(): void {
    this.setChartOptions();
  }
}
