define('Monitor', {
    data: function () {
        return {
            alertCount: 0,
            alerts: []
        }
    },
    mounted: function () {
        const librariesPromises = [];
        librariesPromises.push(this.loadAxiosLibrary());


        Promise.all(librariesPromises).then(() => {
            this.getAlerts();
        })
    },
    methods: {
        getAlerts() {
            const monitorId = this.$root.currentParameters.monitorId;
            const url = `/rest/s1/tailorsoft/monitors?fromDate=2019-12-04T14:23:57.293Z&thruDate=2019-12-12T14:23:57.388Z&monitorId=${monitorId}`;

            axios.get(url).then((res) => {
                this.data = res.data.value[0];
                this.alerts = this.data.alerts.map((alert)=>{
                    return {
                        fromDate: moment(alert.fromDate).format("DD MMM, HH:MM a")
                    }
                });

                renderVega(this.data, 'chartjsContainer');
                this.alertCount = this.alerts.length;


            }).catch(function (err) {
                console.log(err)
            });
        },
        loadAxiosLibrary() {
            return new Promise(function (resolve, reject) {
                const importAxios = document.createElement("script");
                const scriptType = "text/javascript";
                importAxios.type = scriptType;
                importAxios.src = "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js";
                importAxios.async = false;
                importAxios.onload = function () {
                    resolve()
                };
                document.head.appendChild(importAxios);
            })
        },
    }
});