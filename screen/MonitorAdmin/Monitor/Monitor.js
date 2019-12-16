define("Monitor", {
    data: function () {
        return {
            alertCount: 0,
            alerts: [],
            displayFromDate: '',
            displayThruDate: ''
        };
    },
    mounted: function () {
        const librariesPromises = [];
        librariesPromises.push(this.loadAxiosLibrary());

        const fromDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5);
        const thruDate = new Date(Date.now() + 1000 * 60 * 100);

        Promise.all(librariesPromises).then(() => {
            this.getAlerts(fromDate, thruDate);
        });
    },
    methods: {
        getAlerts(_fromDate, _thruDate) {
            const monitorId = this.$root.currentParameters.monitorId;

            const fromDate = moment(_fromDate).startOf('day');
            const thruDate = moment(_thruDate).endOf('day');

            this.displayFromDate = fromDate.format('YYYY-MM-DD');
            this.displayThruDate = thruDate.format('YYYY-MM-DD');

            const url = `/rest/s1/tailorsoft/monitors?fromDate=${fromDate.toISOString()}&thruDate=${thruDate.toISOString()}&monitorId=${monitorId}`;

            axios
                .get(url)
                .then(res => {
                    this.data = res.data.value[0];
                    this.alerts = this.data.alerts.map(alert => {
                        return {
                            fromDate: moment(alert.fromDate).format("DD MMM, HH:MM a")
                        };
                    });

                    renderVega(this.data, "chartjsContainer");
                    this.alertCount = this.alerts.length;
                })
                .catch(function (err) {
                    console.log(err);
                });
        },
        loadAxiosLibrary() {
            return new Promise(function (resolve, reject) {
                const importAxios = document.createElement("script");
                const scriptType = "text/javascript";
                importAxios.type = scriptType;
                importAxios.src =
                    "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js";
                importAxios.async = false;
                importAxios.onload = function () {
                    resolve();
                };
                document.head.appendChild(importAxios);
            });
        },
        setDates({type, target}) {
            const fromDate = moment(this.displayFromDate, 'YYYY-MM-DD').startOf('day').toDate();
            const thruDate = moment(this.displayThruDate, 'YYYY-MM-DD').endOf('day').toDate();

            this.getAlerts(moment(fromDate), moment(thruDate))
        }
    }
});