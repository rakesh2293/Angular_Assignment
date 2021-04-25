
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
import * as Highcharts from 'Highcharts';
@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  tableData: any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions = {
    chart: {
      animation: false,
      styledMode: false,
      type: '',
      backgroundColor: '#EFEFEF',
    },

    title: {
      text: ''
    },

    subtitle: {
      text: ''
    },
    annotationsOptions: {
      enabledButtons: false
    },
    legend: {
      enabled: false,
    },
    exporting: {
      fallbackToExportServer: false,
      libURL: 'assets/js/',
      enabled: false
    },
    credits: {
      enabled: false
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
          // connectorColor: '#777',
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        point: {
          events: {
            click: function () {

            }
          }
        },
        cursor: 'pointer',
        borderWidth: 3
      }
    },

    series: [],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          plotOptions: {
            series: {
              // dataLabels: {
              //     format: '<b>{point.name}</b>'
              // }
            }
          }
        }
      }]
    }
  };
  percentage: number;
  chartInstance: object = {};
  chartHeight: number = 260;
  chartData: any;
  screensize: any = {};
  mockapiUrl = 'https://jsonplaceholder.typicode.com/users'
  apiSubscribe:any;
  constructor(private _zone: NgZone,public http: HttpClient) { }

  ngOnInit() {
   
    this.getTableDetails()
  }

  /* Charat Instance Call */
  getChartInstance(event): void {
    this.chartInstance = event;
    setTimeout(() => {
      this.getChartData()
    }, 0);
  }

  /* get chart data call */
  getChartData() {
    let lat = []
    let long = []
    for (let i = 0; i < this.tableData.length; i++) {
      lat.push(this.tableData[i]['address']['geo']['lat'])
      long.push(this.tableData[i]['address']['geo']['lng'])
    }
  
    let parameterData = {
      latcount11:[],
      longcount1:[],
      latcount22:[],
      longcount2:[]
    }

    parameterData['latcount1'] = lat.filter((data:any) => {
      if(data>0) {
        return data
      }
    })
    parameterData['latcount2'] = lat.filter((data:any) => {
      if(data<0) {
        return data
      }

    })
  
    parameterData['longcount1'] = long.filter((data:any) => {
      if(data>0) {
        return data
      }

    })

    parameterData['longcount2'] = long.filter((data:any) => {
      if(data<0) {
        return data
      }

    })

    this.chartData = {
      data: [{
        name: 'Latitude',
        y: parameterData['latcount1'].length,
        color: '#FC182C'
      }, {
        name: 'Latitude',
        y: parameterData['latcount2'].length,
        color: '#34C4C1'
      }, {
        name: 'Longitude',
        y: parameterData['longcount1'].length,
        color: '#FCBD49'
      }, {
        name: 'Longitude',
        y: parameterData['longcount2'].length,
        color: '#d1d2d9'
      }]
    }

    if (this.chartInstance['series'].length == 0) {
      this.chartInstance['addSeries']({
        "data": this.chartData.data,
        "name": this.chartData['name'],
        "type": "pie"
      });
    }

  }

  /* Afterviewinit() */
  ngAfterViewInit() {
    this.onResize({
      'target': {
        "innerWidth": window.innerWidth
      }
    });
  }

  /* on resize function call */
  onResize(event) {
    if (this.screensize) {
      clearInterval(this.screensize);
      this.screensize = false;
    }
    this.screensize = setTimeout(() => {
      let chartContWidth = null;
      try {
        chartContWidth = document.getElementsByClassName('highChartParCont')[0]['offsetWidth'];
      }
      catch (exception) { }
      this.screensize = setTimeout(() => {
        let chartContWidth = null;
        try {
          chartContWidth = document.getElementsByClassName('highChartParCont')[0]['offsetWidth'];
        }
        catch (exception) { }
        this._zone.runOutsideAngular(() => {
          this.chartInstance['setSize'](chartContWidth, this.chartHeight, false);
        });
      }, 200);
    },0)
  }

  /** Function which calls the table details */
  getTableDetails() {
    this.apiSubscribe = this.http.get(this.mockapiUrl)
    .subscribe(res =>{
      this.tableData = res;
      if(this.tableData) {
        this.percentage = this.tableData.length;
      }
    })
    
  }

  /**ngDestroty */
  ngOnDestroy() {
    this.apiSubscribe.unsubscribe()
  }
}

