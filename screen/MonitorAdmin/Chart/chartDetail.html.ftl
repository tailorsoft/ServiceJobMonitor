<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<div class="main">
    <div class="dateControl">
        <input id="startDateInput" type="date" class="dateInput"/>
        <input id="endDateInput" type="date" class="dateInput"/>
    </div>
    <div class="cont" id="cont">
    </div>
</div>

<script type="text/javascript">
    function parseDate(date) {
        // return date.getFullYear() +"-"+(date.getMonth()+1)+"-"+date.getDate()
        return date.toISOString()
    }

    const DaysOld = new Date(Date.now() - (1000 * 60 * 60 * 24 * 3));

    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');

    startDateInput.onchange = changeDate;
    endDateInput.onchange = changeDate;

    function changeDate() {
        const startDate = new Date(startDateInput.value)
        const endDate = new Date(endDateInput.value);

        fetchData(startDate, endDate)
    }

    function setDates(startDate, endDate) {
        startDateInput.value = startDate.toISOString().slice(0, 10);
        endDateInput.value = endDate.toISOString().slice(0, 10);
    }

    let charts = null;

    function fetchData(startDate, endDate) {
        setDates(startDate, endDate);

        fetch('/rest/s1/tailorsoft/monitors?fromDate=' + parseDate(startDate) + "&thruDate=" + parseDate(endDate) + "&jobName=" + "${jobName}")
            .then(function (response) {
                return response.json();
            })
            .then((data) => {
                if (charts) {
                    charts.forEach((chart) => {
                        chart.destroy();
                    })
                }

                charts = data.value.map(generateGraph);
                charts.forEach((chart) => {
                    chart.render()
                })
            });
    }

    fetchData(DaysOld, new Date());

    const cont = document.getElementById('cont');

    /**
     * Generate html div and fill with apexcharts
     * @param {Object} chartData - chart object data
     * @param {string} chartData.indexName ES index data
     * @param {Array} chartData.data - timeseries data
     * @param {Object} chartData.bounds - bounds object
     * @param {int} chartData.bound.upper
     * @param {int} chartData.bound.lower
     */
    function generateGraph(chartData) {
        const newDoc = document.createElement('div');
        const newLink = document.createElement('a');

        newDoc.className = 'chartItem';
        newDoc.id = chartData.indexName;

        cont.appendChild(newDoc);

        const options = {
            chart: {
                type: 'line',
                height: 400
            },
            stroke: {
                show: true,
                width: 1.2,
                color: 'steelblue'
            },
            xaxis: {
                type: "datetime",
            },
            grid: {
                show: true,
                yaxis: {
                    lines: {
                        show: false
                    }
                }
            },
            colors: ["#4682b4"],
            series: [{
                color: 'steelblue',
                name: chartData.indexName,
                data: chartData.data.map((point) => {
                        return [
                            new Date(point["@timestamp"]).getTime(),
                            parseFloat(point.value)
                        ]
                    }
                )
            }],
        };

        options.annotations = {};
        options.annotations.yaxis = [];
        options.annotations.xaxis = [];
        options.annotations.points = [];
        if (chartData.bounds) {


            options.annotations.yaxis.push({
                y: chartData.bounds.upper,
                borderColor: "#00E396",
                label: {
                    borderColor: "#00E396",
                    style: {
                        color: "#fff",
                        background: "#00E396"
                    },
                    text: "upperBound"
                }
            });

            if (chartData.bounds.lower > 0) {
                options.annotations.yaxis.push({
                    y: chartData.bounds.lower,
                    borderColor: "#00E396",
                    label: {
                        borderColor: "#00E396",
                        style: {
                            color: "#fff",
                            background: "#00E396"
                        },
                        text: "lower bound"
                    }
                })
            }
        }

        function addAlert(type, point) {
            const color = type === 'open' ? "#FF4560" : "#008000"

            options.annotations.points.push({
                x: new Date(point['@timestamp']).getTime(),
                y: point.value,
                marker: {
                    size: 2.5,
                    fillColor: color,
                    strokeColor: color,
                    radius: 2
                },
            })
        }

        const reducer = (acc, point, i) => {
            if (
                i > chartData.bounds.count + 1 &&
                point.value >= chartData.bounds.upper &&
                chartData.data[i - chartData.bounds.count].value < chartData.bounds.upper &&
                (acc.length === 0 || acc[acc.length - 1].status !== 'open')
            ) {
                const subSet = chartData.data.slice(i - (chartData.bounds.count - 1), i + 1);

                let allPointsValid = true;

                subSet.forEach(p => {
                    if (p.value < chartData.bounds.upper) {
                        allPointsValid = false;
                    }
                });

                allPointsValid ? acc.push({status: 'open', point: subSet[0]}) : false;
            }

            if (
                acc.length > 0 &&
                acc[acc.length - 1].status === 'open' &&
                point.value < chartData.bounds.upper
            ) {
                const subSet = chartData.data.slice(i - (chartData.bounds.count - 1), i + 1);
                let allPointsValid = true;

                subSet.forEach(p => {
                    if (p.value >= chartData.bounds.upper) {
                        allPointsValid = false;
                    }
                });

                allPointsValid
                    ? acc.push({
                        status: 'closed',
                        point: subSet[0]
                    })
                    : false;
            }
            return acc;
        };

        const alerts = chartData.data.reduce(reducer, []);

        alerts.forEach((point) => {
            addAlert(point.status, point.point)
        });

        for (let i = 0; i < alerts.length; i++) {
            const alert = alerts[i];
            if (alert.status === 'open' && i < alerts.length - 1) {
                options.annotations.xaxis.push({
                    x: new Date(alert.point["@timestamp"]).getTime(),
                    x2: new Date(alerts[i+1].point["@timestamp"]).getTime(),
                    strokeDashArray: 0,
                    fillColor: '#ffe4de',
                    label: {
                        borderColor: '#775DD0',
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                        text: '     ',
                    }
                });

                i++;
            }
        }


        return new ApexCharts(document.querySelector("#" + chartData.indexName), options)
    }

    // // generateGraph(jsonData[2])
    // jsonData.map(generateGraph).forEach((chart) => {
    //     chart.render()
    // })

</script>