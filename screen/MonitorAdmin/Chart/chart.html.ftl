<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<div class="main">
    <div class="dateControl">
        <input id="startDateInput" type="date" class="dateInput" />
        <input id="endDateInput" type="date" class="dateInput" />
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
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        fetchData(startDate, endDate)
    }

    function setDates(startDate, endDate) {
        startDateInput.value = startDate.toISOString().slice(0,10);
        endDateInput.value = endDate.toISOString().slice(0,10);
    }

    let charts = null;

    function fetchData(startDate, endDate) {
        setDates(startDate, endDate);

        fetch('/rest/s1/tailorsoft/monitors?fromDate=' + parseDate(startDate) + "&thruDate=" + parseDate(endDate))
            .then(function (response) {
                return response.json();
            })
            .then((data) => {
                if(charts){
                    charts.forEach((chart)=>{
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
        const chartDiv = document.createElement('div');
        const newLink = document.createElement('a');

        newLink.innerText = chartData.jobName;
        newLink.href = '/vapps/monitor/Chart/ChartDetail?jobName='+chartData.jobName;

        chartDiv.className = 'chartItem';
        chartDiv.id = chartData.indexName;

        const chartContainer = document.createElement('div');
        chartContainer.innerHTML = "";
        chartContainer.append(newLink);
        chartContainer.append(chartDiv);

        cont.appendChild(chartContainer);

        const options = {
            chart: {
                type: 'line',
                height: 400
            },
            stroke: {
                show: true,
                width: 2,
            },
            xaxis: {
                type: "datetime",
            },
            series: [{
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

        const alerts = [];


        function addAlert(type, point) {
            alerts.push({type: type, point})


            // options.annotations.xaxis.push({
            //     // in a datetime series, the x value should be a timestamp, just like it is generated below
            //     x: new Date(point['@timestamp']).getTime(),
            //     strokeDashArray: 0,
            //     label: {
            //         style: {
            //             color: "#fff",
            //             background: type === 'start' ? '#FF4560' : '#00E396'
            //         },
            //         text: "Alert "+type
            //     }
            // });

            options.annotations.points.push({
                x: new Date(point['@timestamp']).getTime(),
                y: point.value,
                marker: {
                    size: 6,
                    fillColor: "#fff",
                    strokeColor: "#2698FF",
                    radius: 2
                },
                label: {
                    borderColor: "#FF4560",
                    offsetY: 0,
                    style: {
                        color: "#fff",
                        background: type === 'start' ? '#FF4560' : '#00E396'
                    },

                    text: "Alert sent to daniel"
                }
            })


        }

        chartData.data.filter((point, i) => {
            if (
                point.value >= chartData.bounds.upper &&
                chartData.data.length > i + 1 &&
                i > chartData.bounds.count &&
                chartData.data[(i - chartData.bounds.count) - 1].value < chartData.bounds.upper
            ) {
                let validPoint = true;

                const subSet = chartData.data.slice(i - chartData.bounds.count, i);
                subSet.forEach((p) => {
                    if (p.value < chartData.bounds.upper) {
                        validPoint = false;
                    }
                });

                return validPoint;
            }

            return false;
        })
            .forEach((point) => {
                addAlert('start', point)
            });

        return new ApexCharts(document.querySelector("#" + chartData.indexName), options)
    }

    // // generateGraph(jsonData[2])
    // jsonData.map(generateGraph).forEach((chart) => {
    //     chart.render()
    // })

</script>