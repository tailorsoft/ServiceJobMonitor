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
            showPartyAssigmentDialog: false,
            containerIssueUrlDialogKey: 0, //Helps to re-render dialog component
            containerPartyAssigmentDialogKey: 9999, //Helps to re-render dialog component
            currentAlertId: null,
            newIssueUrl: '',
            partyIdSelected: '',
            partiesList: []
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
                this.containerIssueUrlDialogKey += 1;
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
        showPartyDialog(alertId){
            this.currentAlertId = alertId;
            this.showPartyAssigmentDialog = true;

            this.$nextTick().then(() => {
                this.containerPartyAssigmentDialogKey += 1;
            });
        },
        assignPartyToAlert(){
            var vm =this;
            const url = '/rest/s1/tailorsoft/alerts/' + this.currentAlertId;
            const notiMsg = 'Party assigned to alert correctly!';

            this.$root.loading = 1;

            this.$nextTick().then(() => { //Avoid the annulment of the $root.loading value setted to 1
                axios.put(url, {partyId: this.partyIdSelected}, this.axiosConfig).then(res => {
                    vm.partyIdSelected = '';
                    vm.$refs.formAlertsList.fetchRows();
                    vm.$refs.assignPartyDialog.hide();
                    vm.$root.loading = 0;
                    moqui.notifyMessages([{message:notiMsg, type:'success'}], null, null);
                    this.getAlerts()
                }).catch(err => {
                    vm.$root.loading = 0;
                    moqui.handleAjaxError(err.response.request, 'error', err.response.data)
                })
            })
        },
        deleteParty(alertId){
            var vm =this;
            const url = '/rest/s1/tailorsoft/alerts/' + alertId;
            const notiMsg = 'Party deleted from alert correctly!';

            this.$root.loading = 1;

            this.$nextTick().then(() => { //Avoid the annulment of the $root.loading value setted to 1
                axios.put(url, {partyId: ''}, this.axiosConfig).then(res => {
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