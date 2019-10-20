const pieChart = Vue.component('pie-chart', {
  props: ['chart-data'],
  template: `
    <div class="this-month-chart" id="monthChart"></div>
  `,
  data() {
    return {
      chart: undefined,
      config: {
        credits: { enabled: false },
        exporting: { enabled: false },
        title: {
          align: 'left',
          text: '',
        },
        chart: {
          height: 400,
          width: 600,
          animation: false,
          backgroundColor: '#f8f9fa',
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
              format: '{point.y:.2f}',
              distance: -25,
              style: {
                fontSize: '24px',
                textOutline: 0
              },
            },
            animation: false,
            showInLegend: true,
          },
        },
        legend: {
          layout: 'vertical',
          verticalAlign: 'middle',
          align: 'right',
          format: '{point.y:.2f}',
          symbolHeight: 15,
          symbolRadius: 5,
          symbolPadding: 10,
          itemMarginTop: 10,
          itemMarginBottom: 10,
          itemStyle: {
            fontSize: '15px'
          },
          labelFormatter: function (params) {
            return `${this.name} ${(this.y).toFixed(2)} HR`;
          },
        },
        series: [{
          type: 'pie',
          innerSize: '55%',
          name: 'HOURS',
          data: [{
            name: 'NONE',
            y: 0,
          }],
        },],
      }
    }
  },
  watch: {
    chartData() {
      let sumHour = this.sumHour(this.chartData);

      this.chart.update({
        title: {
          text: `TOTAL HOUR ${sumHour.toFixed(2)} HR`
        },
        series: {
          data: this.chartData
        },
      }, true);
    },
    config() {
      this.render();
    },
  },
  mounted() {
    this.render();
  },
  beforeDestroy() {
    this.chart.destroy();
  },
  methods: {
    render() {
      let sumHour = this.sumHour(this.chartData);

      this.chart = Highcharts.chart('monthChart', this.config);

      this.chart.update({
        title: {
          text: `TOTAL HOUR ${sumHour.toFixed(2)} HR`
        },
        series: {
          data: this.chartData
        },
      }, true);
    },
    sumHour(logs) {
      let sum = 0;
      _.each(logs, (log) => {
        sum += log.y;
      });
      return sum;
    }
  }
});

const columnChart = Vue.component('column-chart', {
  props: ['chart-data'],
  template: `
    <div class="this-column-chart" id="columnChart"></div>
  `,
  data() {
    return {
      chart: undefined,
      config: {
        exporting: { enabled: false },
        title: '',
        chart: {
          type: 'column',
          backgroundColor: '#f8f9fa',
        },
        xAxis: {
          categories: ["2019-05", "2019-07", "2019-08", "2019-09", "2019-10"]
        },
        yAxis: {
          // min: 0,
          title: {
            text: ''
          },
          stackLabels: {
            enabled: true,
          }
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: [
          {
            name: 'jobs',
            data: [1,2,3,4,5],
          }, {
            name: 'usr',
            data: [1,2,3,4,5],
          }, {
            name: 'adm',
            data: [1,2,3,4,5],
          }, {
            name: 'meetings',
            data: [1,2,3,4,5],
          }, {
            name: 'chk',
            data: [1,2,3,4,5],
          }
        ]
      },
    }
  },
  watch: {
    chartData() {
      let xAxis = _.keys(this.chartData);
      let seriesTmp = {
        jobs: [],
        usr: [],
        adm: [],
        meetings: [],
        chk: [],
      };
      _.each(this.chartData, (log, month) => {
        let calcWorkTime = this.calcWorkTime(log);
        seriesTmp['jobs'].push(calcWorkTime['jobs']);
        seriesTmp['usr'].push(calcWorkTime['usr']);
        seriesTmp['adm'].push(calcWorkTime['adm']);
        seriesTmp['meetings'].push(calcWorkTime['meetings']);
        seriesTmp['chk'].push(calcWorkTime['chk']);
      });
      let series = [
        {
          name: 'JOBS',
          data: seriesTmp['jobs'],
        }, {
          name: 'USR',
          data: seriesTmp['usr'],
        }, {
          name: 'ADM',
          data: seriesTmp['adm'],
        }, {
          name: 'MEETINGS',
          data: seriesTmp['meetings'],
        }, {
          name: 'CHK',
          data: seriesTmp['chk'],
        }
      ];

      this.chart = Highcharts.chart('columnChart', this.config);

      this.chart.update({
        xAxis: {
          categories: xAxis
        },
        series: series,
      }, true);
    },
    config() {
      this.render();
    },
  },
  mounted() {
    this.render();
  },
  beforeDestroy() {
    this.chart.destroy();
  },
  methods: {
    render() {
      let xAxis = _.keys(this.chartData);
      let seriesTmp = {
        jobs: [],
        usr: [],
        adm: [],
        meetings: [],
        chk: [],
      };
      _.each(this.chartData, (log, month) => {
        let calcWorkTime = this.calcWorkTime(log);
        seriesTmp['jobs'].push(calcWorkTime['jobs']);
        seriesTmp['usr'].push(calcWorkTime['usr']);
        seriesTmp['adm'].push(calcWorkTime['adm']);
        seriesTmp['meetings'].push(calcWorkTime['meetings']);
        seriesTmp['chk'].push(calcWorkTime['chk']);
      });
      let series = [
        {
          name: 'JOBS',
          data: seriesTmp['jobs'],
        }, {
          name: 'USR',
          data: seriesTmp['usr'],
        }, {
          name: 'ADM',
          data: seriesTmp['adm'],
        }, {
          name: 'MEETINGS',
          data: seriesTmp['meetings'],
        }, {
          name: 'CHK',
          data: seriesTmp['chk'],
        }
      ];

      this.chart = Highcharts.chart('columnChart', this.config);

      this.chart.update({
        xAxis: {
          categories: xAxis
        },
        series: series,
      }, true);
    },
    calcWorkTime(workList) {
      let calcLog = {
        jobs: 0,
        usr: 0,
        adm: 0,
        chk: 0,
        meetings: 0,
      };
      _.each(workList, (log) => {
        let type = log['type'].toLowerCase();
        if (_.isUndefined(calcLog)) {
          calcLog[type] = 0;
        }
        calcLog[type] += log['worktime'];
      });

      // console.log(calcLog);
      return calcLog;
    },
  }
})

var app = new Vue({
  el: '#app',
  components: { pieChart, columnChart },
  data: {
    logs: [],
    csid: '',
    selectedMonth: '',
  },
  created() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    this.csid = url.searchParams.get("csid");

    this.getWorklogs();
  },
  computed: {
    logsByMonth() {
      let logsByMonth = {};
      _.each(this.logs, (log) => {
        let month = moment(log.datetime).format('YYYY-MM');
        if (_.isUndefined(logsByMonth[month])) {
          logsByMonth[month] = [];
        }
        logsByMonth[month].push(log);
      });
      return logsByMonth;
    },
  },
  mounted() {
  },
  methods: {
    getWorklogs() {
      fetch('./worklogs.json')
        .then(response => response.json())
        .then(json => {
          this.logs = json['csta'][this.csid];
        })
    },
    calcWorkTime(workList) {
      let calcLog = {
        jobs: 0,
        usr: 0,
        adm: 0,
        chk: 0,
        meetings: 0,
      };
      _.each(workList, (log) => {
        let type = log['type'].toLowerCase();
        if (_.isUndefined(calcLog)) {
          calcLog[type] = 0;
        }
        calcLog[type] += log['worktime'];
      });

      // console.log(calcLog);
      return calcLog;
    },
    calcWorkTimeForChart(workList) {
      let parseData = [];
      let calcLog = this.calcWorkTime(workList);

      _.each(calcLog, (hours, workType) => {
        if (hours) {
          parseData.push({
            name: workType.toUpperCase(),
            y: hours,
          });
        }
      });
      if (parseData.length === 0) {
        parseData = [{
          name: 'NONE',
          y: 0,
        }];
      }

      return parseData;
    }
  }
})