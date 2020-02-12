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

    @Input('source') sourceData: Object;
    @ViewChild(BaseChartDirective, {static: false}) _chart: BaseChartDirective;
    
    public graphTitle:String = '';
    
    public graphType:Object[] = [
        {
            key: 'Log',
            value: 'logarithmic'
        }, 
        {
            key: 'Linear',
            value: 'linear'
        }];
    
    public changeGraphType(newValue) {
        this._chart.chart.config.options.scales.yAxes[0].type = newValue;
        this._chart.chart.update();
    }
    
    //Defaults
    public barChartType: ChartType = 'bar';
    public barChartLegend = false;
    public barChartPlugins = [pluginDataLabels];
    //Chart Values
    public barChartOptions: ChartOptions = {};
    public barChartData: ChartDataSets[] = [];
    public barChartLabels: Label[] = [];
    //Custom
    public barColors;
    public lblColors;
    
    constructor() {
    }
    
    ngOnInit(){
          
        //Set Title
        this.graphTitle = (this.sourceData.hasOwnProperty('title')) ? this.sourceData['title'] : 'Default Title';
        
    }
    
    ngOnChanges(){
        
        
        var cData = this.sourceData['data'];
        var cPrevious = [], cToday = [], cInvert = [], cShowValues = [];

        //Init Bar Colors Arrays
        this.barColors = Array.apply(null, Array(cData.length)).map(function() { return '#CCC' });
        this.lblColors = Array.apply(null, Array(cData.length)).map(function() { return '#CCC' });
        this.barChartLabels.length = 0;
        
        for(var i=0; i<cData.length;i++){
            //Init Labels
            this.barChartLabels.push(cData[i].title);
            //Init Data
            cPrevious.push(cData[i].yesterday);
            cToday.push(cData[i].today);
            //Customs
            cInvert.push(cData[i].invert);
            cShowValues.push(cData[i].showValues);
        }

          //Init Bar Chart Options
          this.barChartOptions = {
              responsive: true,
              tooltips:{ enabled: false },
              layout: {
                  padding: {
                      left: 0,
                      right: 0,
                      top: 60,
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

          //Init Bar Chart Data
          this.barChartData = [
              { 
                label: 'Yesterday',
                backgroundColor: '#EBF0F4', 
                hoverBackgroundColor: '#EBF0F4', 
                barPercentage: 0.4,
                data: cPrevious,
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
                data: cToday,
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

                                if(cShowValues[context.dataIndex] !== 'value')
                                    return getPercentageChange(value, context.chart.data.datasets[0].data[context.dataIndex]);
                                else
                                    return '';

                            }
                        }
                    },
                    formatter: function(value, context) {

                        var currIndex = context.dataIndex;
                        var prevData = context.chart.data.datasets[0].data[currIndex];

                        // Format Colors 
                        if(!cInvert[currIndex]){
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
                                  return (n / ranges[i].divider).toFixed(0).toString() + ranges[i].suffix;
                               }
                            }
                            return Math.round(n).toFixed(2);
                         }

                        if(cShowValues[context.dataIndex] !== 'change')
                            return formatNumber(value);
                        else
                            return '';
                    }
                }
            }
          ];
        
        if (this._chart !== undefined) {
            this._chart.chart.update();
        }
        
    }
    
    
    
    

}
