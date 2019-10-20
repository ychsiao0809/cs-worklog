var app = new Vue({
  el: '#app',
  data: {
    worklogs: [],
    activeGroup: 'www',
  },
  created() {
    this.getWorklogs();
  },
  computed: {
    activeTAs() {
      let _this = this;
      let thisMonth = moment().format("YYYY/MM");
      let cstas = this.worklogs[this.activeGroup];
      // console.log(this.activeGroup);

      let tas = {};
      _.each(cstas, (ta, csid) => {
        tas[csid] = _.filter(ta, log => {
          return log['datetime'].indexOf(thisMonth) !== -1;
        });
      });

      return tas;
    }
  },
  mounted() {
  },
  methods: {
    getWorklogs() {
      fetch('./worklogs.json')
        .then(response => response.json())
        .then(json => {
          this.worklogs = json;
        })
    },
    calcWorkTime(workList) {
      let calcLog = {
        list: {
          jobs: 0,
          usr: 0,
          adm: 0,
          chk: 0,
          meetings: 0,
        },
        total: 0,
      };
      _.each(workList, (log) => {
        let type = log['type'].toLowerCase();
        if (_.isUndefined(calcLog)) {
          calcLog[type] = 0;
        }
        calcLog['list'][type] += log['worktime'];
        calcLog['total'] += log['worktime'];
      });

      // console.log(calcLog);
      return calcLog;
    },
  }
})