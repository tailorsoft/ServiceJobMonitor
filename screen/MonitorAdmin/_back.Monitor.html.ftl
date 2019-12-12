<html>
<body>
<div class="ts-container">
    <div class="monitorContainer">
        <div class="monitorSidebar">
            <div class="sidebarHeader"> <span id="sideAlertsCount">0</span> open alerts</div>
            <div class="sidebarBody" id="sidebarAlertsContainer"></div>
            <div></div>
        </div>
        <div class="monitorChart">
            <div class="chartHeader">Show From</div>
            <div id="chartjsContainer" class="chartBody"></div>
        </div>
    </div>
</div>
<script type="text/javascript">
    const monitorId = "${monitor.monitorId}";

    fetchSingleChart(monitorId, DaysOld,new Date(Date.now()+1000*60*60*24)).then((data)=>{
        renderVega(data, 'chartjsContainer');
        renderSideAlerts(data, 'sidebarAlertsContainer', 'sideAlertsCount');
    })

</script>
</body>
</html>