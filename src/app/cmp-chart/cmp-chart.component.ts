import { Component, Input, OnInit } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-cmp-chart',
  templateUrl: './cmp-chart.component.html',
  styleUrls: ['./cmp-chart.component.scss']
})
export class CmpChartComponent implements OnInit {

    @Input('source') sourceData: string;
    
    
      public barChartOptions: ChartOptions = {
        responsive: true,
        plugins: {},
        tooltips:{ enabled: false },
        scales: { 
                xAxes: [{
                  gridLines: {
                    display: false,
                  },
                  ticks: {
                    fontColor: '#333A49',
                    fontStyle: 'bold',
                  }
                }], 
                yAxes: [{
                   gridLines: {
                       zeroLineWidth: 0,
                       zeroLineColor: 'rbga(0,0,0,0)'
                    },
                   ticks: {
                      fontColor: '#333A49',
                      fontStyle: 'bold',
                      callback: function(value) {
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
                            return n;
                         }
                         return formatNumber(value);
                      },

                   }

                }]
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
            data: [80000, 81000, 85000, 100000, 130000],
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
            data: [100000, 90000, 76000, 120000, 125000],
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
                    
                    console.log(context);
                    
                    
                    var currIndex = context.dataIndex;
                    var prevData = context.chart.data.datasets[0].data[currIndex];
                    
                    var invertBehavior = [false, true, true, false, false];
                    // Format Colors 
                    if(invertBehavior[currIndex]){
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
