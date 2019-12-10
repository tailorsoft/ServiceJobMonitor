<html>
<header>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/0.5.7/chartjs-plugin-annotation.js"></script>
    <link rel="stylesheet" href="/tsstatic/css/normalize.css"/>
    <link rel="stylesheet" href="/tsstatic/css/style.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"/>
</header>
<body>
<div class="ts-container">

<#--    <script>-->
<#--        const currentTab = window.location.pathname.split('/').pop();-->
<#--        const element = document.getElementById(currentTab);-->
<#--        element.className = element.className + " active";-->

<#--        if(currentTab !== 'Charts'){-->
<#--            const dateDiv = document.getElementById('dateSelectors');-->
<#--            dateDiv.style = 'display: none';-->
<#--        }-->
<#--    </script>-->

    <div class="topBar">
        <div class="tabMenu">
            <div id="Charts" class="tabMenuItem"><a class="barLink" href="./Charts">charts</a></div>
            <div class="tabMenuItem"><a class="barLink" href="./Alerts">Alerts</a></div>
            <div id="Monitors" class="tabMenuItem"><a class="barLink" href="./Monitors">monitors</a></div>
        </div>
        <div id="dateSelectors" class="dateSelectors">
            <input class="dateSelector" id="startDateInput" type="date">
            <input class="dateSelector" id="endDateInput" type="date">
        </div>
    </div>
</div>
</body>
</html>