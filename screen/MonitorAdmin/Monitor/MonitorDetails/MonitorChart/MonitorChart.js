define("Monitor", {
  data: function() {
    return {
      alertCount: 0,
      alerts: [],
      displayFromDate: "",
      displayThruDate: "",
      monitorId: "",
      monitor: null,
      selectedAlert: null
    };
  },
  mounted: function() {
    const librariesPromises = [];
    librariesPromises.push(this.loadAxiosLibrary());
    librariesPromises.push(this.loadMainJSFile());

    const fromDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5);
    const thruDate = new Date(Date.now() + 1000 * 60 * 100);

    Promise.all(librariesPromises).then(() => {
      this.monitorId = this.$root.currentParameters.monitorId;
      this.getMonitorInfo();
      this.getAlerts(fromDate, thruDate);
    });
  },
  methods: {
    selectAlert(alert) {
      this.selectedAlert = alert;
    },
    getMonitorInfo() {
      const url = "/rest/s1/service-job-monitor/monitors/" + this.monitorId;
      let vm = this;

      axios
        .get(url)
        .then(res => {
          vm.monitor = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAlerts(_fromDate, _thruDate) {
      const fromDate = moment(_fromDate).startOf("day");
      const thruDate = moment(_thruDate).endOf("day");

      this.displayFromDate = fromDate.format("YYYY-MM-DD");
      this.displayThruDate = thruDate.format("YYYY-MM-DD");

      const url = `/rest/s1/service-job-monitor/monitors?fromDate=${fromDate.toISOString()}&thruDate=${thruDate.toISOString()}&monitorId=${
        this.monitorId
      }`;

      axios
        .get(url)
        .then(res => {
          this.data = res.data.value[0];
          this.alerts = this.data.alerts.map(alert => {
            return {
              id: alert.id,
              fromDate: moment(alert.fromDate).format("DD MMM, h:mm a"),
              thruDate: alert.thruDate ? moment(alert.thruDate).format("DD MMM, h:mm a") : null,
              status: alert.statusId,
              value: parseFloat(alert.value).toFixed(2)
            };
          }).reverse();

          renderVega(this.data, "chartjsContainer");
          this.alertCount = this.alerts.length;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    loadAxiosLibrary() {
      return new Promise(function(resolve, reject) {
        const importAxios = document.createElement("script");
        const scriptType = "text/javascript";
        importAxios.type = scriptType;
        importAxios.src =
          "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js";
        importAxios.async = false;
        importAxios.onload = function() {
          resolve();
        };
        document.head.appendChild(importAxios);
      });
    },
    loadMainJSFile(){
      return new Promise(function(resolve, reject) {
        const importMainJS = document.createElement("script");
        const scriptType = "text/javascript";
        importMainJS.type = scriptType;
        importMainJS.src =
            "/jsmstatic/js/main.js";
        importMainJS.async = false;
        importMainJS.onload = function() {
          resolve();
        };
        document.head.appendChild(importMainJS);
      });
    },
    setDates({ type, target }) {
      const fromDate = moment(this.displayFromDate, "YYYY-MM-DD")
        .startOf("day")
        .toDate();
      const thruDate = moment(this.displayThruDate, "YYYY-MM-DD")
        .endOf("day")
        .toDate();

      this.getAlerts(moment(fromDate), moment(thruDate));
    }
  }
});
