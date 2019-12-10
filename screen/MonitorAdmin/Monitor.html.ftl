<html>
<body>
<div class="ts-container">
    <div class="monitorContainer">
        <div class="monitorSidebar">
            <div class="sidebarHeader"> <span>0</span> open alerts</div>
            <div class="sidebarBody"></div>
            <div></div>
        </div>
        <div class="monitorChart">
            <div class="chartHeader">Show From</div>
            <div id="chartjsContainer" class="chartBody"></div>
        </div>
    </div>
</div>
<script src="/tsstatic/js/main.js"></script>
<script type="text/javascript">
    const monitorId = "${monitor.monitorId}";

    fetchSingleChart(monitorId, DaysOld,new Date(Date.now()+1000*60*60*24)).then((data)=>{
        renderVega(data, 'chartjsContainer')
    })
</script>
</body>
</html>