define('Alerts', {
    data: function () {
        return {
            app: 'xx2',
            alerts: []
        }
    },
    mounted: function () {
        var librariesPromises = [];
        librariesPromises.push(this.loadAxiosLibrary());

        console.log('=====', this)

        Promise.all(librariesPromises).then(() => {
            this.getAlerts();
        })
    },
    methods: {
        getAlerts() {
            console.log(this.$root)
            // axios.get("/rest/s1/tailorsoft/alerts").then((res) => {
            //     this.alerts = res.data;
            //
            //     console.log('alerts ===== ')
            //
            // }).catch(function (err) {
            //     console.log(err)
            // });
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