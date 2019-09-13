<style>
    .main {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background-color: #f8f8f8;
    }

    .cont {
        display: flex;
    }

    .title {
        font-size: 30px;
        font-weight: bold;
        padding-left: 10px;
        padding-top: 10px;
    }

    .chartItem {
        flex: 1;
        height: 400px;
        background: #fff;
        border-radius: 2px;
        display: inline-block;
        margin: 1rem;
        position: relative;
        width: 300px;
        padding: 10px;
        border-style: solid;
        border-color: #d6d6d6;
        border-width: 1px;
    }
</style>
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<div class="main">
    <div class="title">Current Monitors</div>
    <div class="cont" id="cont">
    </div>
</div>

<script type="text/javascript">

    function parseDate(date) {
        // return date.getFullYear() +"-"+(date.getMonth()+1)+"-"+date.getDate()
        return date.toISOString()
    }

    const DaysOld = new Date(Date.now() - (1000 * 60 * 60 * 24 * 3));

    fetch('/rest/s1/tailorsoft/monitors?fromDate=' + parseDate(DaysOld) + "&thruDate=" + parseDate(new Date()))
        .then(function (response) {
            return response.json();
        })
        .then((data) => {
            data.value.map(generateGraph).forEach((chart) => {
                chart.render()
            })
        });

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
                width: 2,
            },
            title: {
                text: chartData.indexName,
                align: "left"
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

        for (let i = 0; i < chartData.data.length; i++) {
            const point = chartData.data[i];
            const pointValue = parseFloat(point.value);

            if (chartData.bounds && pointValue >= chartData.bounds.upper
                && (alerts.length === 0 || (alerts.length > 0 && alerts[alerts.length - 1].type === 'end'))
            ) {

                addAlert('start', point)
            }

            if (alerts.length > 0 && alerts[alerts.length - 1].type === 'start' && pointValue < chartData.bounds.upper) {
                addAlert('end', point)
            }
        }

        return new ApexCharts(document.querySelector("#" + chartData.indexName), options)
    }

    // // generateGraph(jsonData[2])
    // jsonData.map(generateGraph).forEach((chart) => {
    //     chart.render()
    // })

</script>

<script>

</script>
