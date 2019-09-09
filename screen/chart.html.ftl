<style>
    .cont {
        display: flex;
    }

    .chartItem {
        flex: 1;
        height: 400px;
    }
</style>
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<div class="cont" id="cont">
</div>

<script type="text/javascript">

    fetch('/rest/s1/tailorsoft/monitors')
        .then(function(response) {
            return response.json();
        })
        .then((data)=>{
            data.value.map(generateGraph).forEach((chart)=>{ chart.render()})
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
                height: 600
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
                labels: {
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: 'MMM \'yy',
                        day: 'dd MMM',
                        hour: 'HH:mm'
                    }
                }
            },
            series: [{
                name: chartData.indexName,
                data: chartData.data.map((point) => {
                        return [
                            new Date(point["@timestamp"]).getTime(),
                            point.value
                        ]
                    }
                )
            }],
        };

        if (chartData.bounds) {
            options.annotations = {};
            options.annotations.yaxis = [];
            options.annotations.xaxis = []

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

        const alerts = []

        for (let i = 0; i < chartData.data.length; i++) {
            
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
