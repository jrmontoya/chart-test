import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-cmp-chart',
  templateUrl: './cmp-chart.component.html',
  styleUrls: ['./cmp-chart.component.scss']
})
export class CmpChartComponent implements OnInit {

    @Input('source') sourceData: string;
    @ViewChild(BaseChartDirective, {static: false}) _chart: BaseChartDirective;
    
    public graphType = [
        {
            key: 'Log',
            value: 'logarithmic'
        }, 
        {
            key: 'Linear',
            value: 'linear'
        }];
    
    public onChange(newValue) {
        this._chart.chart.config.options.scales.yAxes[0].type = newValue;
        this._chart.chart.update();
    }
    
      public barChartOptions: ChartOptions = {
        responsive: true,
        tooltips:{ enabled: false },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 30,
                bottom: 0
            }
        },
          
        scales: { 
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                    display: true,
                    drawBorder: true,
                    color: '#EBF0F4',
                    zeroLineColor: 'transparent'
                    
                },
                ticks: {
                    fontColor: '#333A49',
                    fontStyle: 'bold',
                    beginAtZero: true
                },
            }], 
            yAxes: [{
                type: 'logarithmic',
                gridLines: {
                    drawBorder: false,
                    color: '#EBF0F4',
                    zeroLineColor: '#EBF0F4'
                },
                ticks: {
                    fontColor: '#333A49',
                    fontStyle: 'bold',
                    maxTicksLimit: 5,
                    beginAtZero: true,
                    suggestedMin: 0,
                    mirror:false,
                    callback: function(value) {
                        if(value >= 1){
                            var ranges = [{ divider: 1e3, suffix: 'k' }];
                            function formatNumber(n) {
                                for (var i = 0; i < ranges.length; i++) {
                                    if (n >= ranges[i].divider) {
                                        return (n / ranges[i].divider).toString();
                                    }
                                }
                                return n;
                            }
                            return formatNumber(value);
                        }
                        else{
                            return value;
                        }
                    },
                }
            }]
        },
        animation: {
          duration: 0,
          onComplete: function(context) {
            var controller = context.chart.controller;
            var chart = controller.chart;
            var yAxis = controller.scales['y-axis-0'];
            var xOffset = chart.width - (chart.width - 20);
            var yOffset = chart.height - (chart.height - 15);
            context.chart.ctx.fillText('(K)', xOffset, yOffset);
          }
        }
        
      };
      
      
      public barColors = ['#CCC','#CCC','#CCC','#CCC','#CCC'];
      public lblColors = ['#CCC','#CCC','#CCC','#CCC','#CCC'];
    
      public barChartLabels: Label[] = ['Open', 'Close', 'Delete', 'Create', 'Stat'];
      public barChartType: ChartType = 'bar';
      public barChartLegend = false;
      public barChartPlugins = [pluginDataLabels];
    
      public barChartData: ChartDataSets[] = [
        { 
            label: 'Yesterday',
            backgroundColor: '#EBF0F4', 
            hoverBackgroundColor: '#EBF0F4', 
            barPercentage: 0.4,
            data: [80000, 81000, 80000, 112000, 1150000],
            datalabels: {
                labels: {
                    title: null
                }
            }
         },
        { 
            label: 'Today', 
            backgroundColor: this.barColors,
            hoverBackgroundColor: this.barColors,
            barPercentage: 1.2,
            data: [100000, 90000, 76000, 120000, 1000000],
            datalabels: {
                anchor: 'end',
                align: 'bottom',
                clamp: true,
                labels: {
                    name: {
                        color: '#FFF',
                        font: {
                            weight: 'bold'
                        }
                    },
                    value: {
                        color: this.lblColors,
                        align: 'top',
                        font: {
                            weight: 'bold'
                        },
                        formatter: function(value, context) {
                            
                            function getPercentageChange(oldNumber, newNumber){
                                var decreaseValue = oldNumber - newNumber;
                                var res = Math.round((decreaseValue / oldNumber) * 100);
                                return (res > 0) ? '+' + res.toString() + '% ↗' : res.toString() + '% ↘';
                            }
                            
                            return getPercentageChange(value, context.chart.data.datasets[0].data[context.dataIndex]);
                        }
                    }
                },
                formatter: function(value, context) {
                    
                    var currIndex = context.dataIndex;
                    var prevData = context.chart.data.datasets[0].data[currIndex];
                    
                    var invertBehavior = [false, true, true, false, false];
                    // Format Colors 
                    if(!invertBehavior[currIndex]){
                        if(value >= prevData){
                            context.dataset.backgroundColor[currIndex]  = '#32D574';
                            context.dataset.hoverBackgroundColor[currIndex]  = '#32D574';
                            context.dataset.datalabels.labels.value.color[currIndex]  = '#32D574';
                        }
                        else{
                            context.dataset.backgroundColor[currIndex]  = '#FE2744';
                            context.dataset.hoverBackgroundColor[currIndex]  = '#FE2744';
                            context.dataset.datalabels.labels.value.color[currIndex]  = '#FE2744';
                        }
                    }
                    else{
                        if(value <= prevData){
                            context.dataset.backgroundColor[currIndex]  = '#32D574';
                            context.dataset.hoverBackgroundColor[currIndex]  = '#32D574';
                            context.dataset.datalabels.labels.value.color[currIndex]  = '#32D574';
                        }
                        else{
                            context.dataset.backgroundColor[currIndex]  = '#FE2744';
                            context.dataset.hoverBackgroundColor[currIndex]  = '#FE2744';
                            context.dataset.datalabels.labels.value.color[currIndex]  = '#FE2744';
                        }
                    }
                    
                    /* Format Number */
                    var ranges = [
                                    { divider: 1e6, suffix: 'M' },
                                    { divider: 1e3, suffix: 'k' }
                                 ];
                    
                    
                    function formatNumber(n) {
                        for (var i = 0; i < ranges.length; i++) {
                           if (n >= ranges[i].divider) {
                              return (n / ranges[i].divider).toString() + ranges[i].suffix;
                           }
                        }
                        return Math.round(n);
                     }
                    
                    return formatNumber(value);
                }
            }
        }
      ];
    
      constructor() {
        
          
      
      }

      ngOnInit() {
      }

}
