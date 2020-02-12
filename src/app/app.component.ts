import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    
    public customChartData: Object = {
        title: 'Dev Chart Assignment',
        data: [
            {
                yesterday: 80000,
                today: 100000,
                title: 'Open',
                showValues: 'both',
                invert: false
            },
            {
                yesterday: 81000,
                today: 90000,
                title: 'Close',
                showValues: 'both',
                invert: true
            },
            {
                yesterday: 80000,
                today: 76000,
                title: 'Delete',
                showValues: 'both',
                invert: true
            },
            {
                yesterday: 112000,
                today: 120000,
                title: 'Create',
                showValues: 'both',
                invert: false
            },
            {
                yesterday: 1150000,
                today: 1000000,
                title: 'Stat',
                showValues: 'both',
                invert: false
            },

        ]
    };
    
    public randomizeData = function(){
        
        var output = [],
            count = Math.floor(Math.random() * 6) + 3;
        
        for(var i=0; i<count; i++){
            output.push({
                yesterday: Math.floor(Math.random() * 1000000) + 70000,
                today: Math.floor(Math.random() * 1000000) + 70000,
                title: 'Option ' + (i + 1),
                showValues: ['value','change','both'][Math.floor(Math.random() * 3) + 1],
                showChange: Math.random() >= 0.5,
                invert: Math.random() >= 0.5
            });
        }
        
        this.customChartData = {
            title: 'Dev Chart Assignment',
            data: output
        };
    }
    
    constructor() {
    
    }
    
    ngOnInit() {
        
    }
}
            