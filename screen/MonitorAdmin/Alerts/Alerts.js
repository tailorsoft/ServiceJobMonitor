define('Alerts', {
    data: function () {
        return {
            alerts: [],
            axiosConfig: {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*",
                    "moquiSessionToken": this.$root.moquiSessionToken
                }
            },
            showNewIssueUrlDialog: false,
            containerDialogKey: 0,
            currentAlertId: null,
            newIssueUrl: ''
        }
    },
    mounted: function () {
        var librariesPromises = [];
        librariesPromises.push(this.loadAxiosLibrary());

        Promise.all(librariesPromises).then(() => {
            this.getAlerts();
        })
    },

    methods: {
        getAlerts(){
            const url = '/rest/s1/tailorsoft/alerts';

            return axios.get(url).then((response)=>{
                this.alerts = response.data.alerts;
            })
        },
        showIssueUrlDialog(alertId){
            this.currentAlertId = alertId;
            this.showNewIssueUrlDialog = true;

            this.$nextTick().then(() => {
                this.containerDialogKey += 1;
            });
        },
        createIssueUrl(){
            var vm =this;
            const url = '/rest/s1/tailorsoft/alerts/' + this.currentAlertId;
            const notiMsg = 'Alert Issue URL added correctly!';

            this.$root.loading = 1;

            this.$nextTick().then(() => { //Avoid the annulment of the $root.loading value setted to 1
                axios.put(url, {issueUrl: this.newIssueUrl}, this.axiosConfig).then(res => {
                    vm.newIssueUrl = '';
                    vm.$refs.formAlertsList.fetchRows();
                    vm.$refs.newIssueUrlDialog.hide();
                    vm.$root.loading = 0;
                    moqui.notifyMessages([{message:notiMsg, type:'success'}], null, null);
                    this.getAlerts()
                }).catch(err => {
                    vm.$root.loading = 0;
                    moqui.handleAjaxError(err.response.request, 'error', err.response.data)
                })
            })
        },
        deleteIssueUrl(alertId){
            var vm =this;
            const url = '/rest/s1/tailorsoft/alerts/' + alertId;
            const notiMsg = 'Alert Issue URL deleted correctly!';

            this.$root.loading = 1;

            this.$nextTick().then(() => { //Avoid the annulment of the $root.loading value setted to 1
                axios.put(url, {issueUrl: ''}, this.axiosConfig).then(res => {
                    vm.$refs.formAlertsList.fetchRows();
                    vm.$root.loading = 0;
                    moqui.notifyMessages([{message:notiMsg, type:'success'}], null, null);
                    this.getAlerts()
                }).catch(err => {
                    vm.$root.loading = 0;
                    moqui.handleAjaxError(err.response.request, 'error', err.response.data)
                })
            })
        },
        formatNumber(num){
          return parseFloat(num).toFixed(2);
        },
        formatDate(date){
            return moment(date).format('lll');
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