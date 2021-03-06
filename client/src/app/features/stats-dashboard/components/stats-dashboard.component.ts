import { Component } from '@angular/core';

@Component({
    selector: 'app-stats-dashboard',
    templateUrl: './stats-dashboard.component.html',
    styleUrls: ['./stats-dashboard.component.scss'],
})
export class StatsDashboardComponent {

    protected chartConfig: any = {
        type: 'line',
        data: {
            labels: ['14:00', '15:00', '16:00', '17:00', '18:00'],
            datasets: [{
                label: 'NO2',
                data: [24, 20, 23, 15, 30],
                backgroundColor: 'lightblue',
                borderColor: 'lightblue',
                fill: false,
            }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                    },
                }],
            },
        },
    };

    protected chartConfig2: any = {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                }],
            },
        },
    };

}
