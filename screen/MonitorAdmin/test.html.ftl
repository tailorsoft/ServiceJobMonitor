<html>
<body>
<div class="ts-container">
    <div id="chartsContainer">
    </div>
    <script src="/tsstatic/js/main.js"></script>
    <script>
        fetchData(DaysOld, new Date(Date.now()+1000*60*60*24));

        const startDateInput = document.getElementById('startDateInput');
        const endDateInput = document.getElementById('endDateInput');


        if (startDateInput && endDateInput) {
            startDateInput.onchange = changeDate;
            endDateInput.onchange = changeDate;
        }


    </script>
</div>
</body>
</html>