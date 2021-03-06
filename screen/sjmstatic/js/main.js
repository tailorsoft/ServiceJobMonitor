// generate div with class

function gDC(tag = "div", className = "") {
  const div = document.createElement(tag);
  div.className = className;
  return div;
}

/**
 *
 * @param {string} name
 * @param { string } type
 * @returns {{chartBox: *, chartCanvas: *}}
 */
function generateBox({ name, type = "", title = "" }) {
  // generate divs
  const chartBox = gDC("div", "chartBox");
  const chartBoxHeader = gDC("div", "chartBoxHeader");
  const chartBoxHeaderTitle = gDC("div", "chartBoxHeaderTitle");
  const chartBoxHeaderOpen = gDC("div", "chartBoxHeaderOpen");
  const chartCanvas = gDC("div", "chartCanvas");

  chartCanvas.id = name;

  // fill with data
  chartBoxHeaderTitle.innerHTML = `<a href='./Monitor/MonitorDetails/MonitorChart?monitorId=${name}'>${title}</a>`;
  chartBoxHeaderOpen.innerHTML = `<a href='./Monitor/MonitorDetails/MonitorChart?monitorId=${name}'>Open Chart <i class=\"fas fa-angle-right\"></i></a>`;

  chartBoxHeader.className = "chartBoxHeader " + type;
  chartBoxHeaderOpen.className = "chartBoxHeaderOpen " + type;

  // append to main node
  chartBoxHeader.append(chartBoxHeaderTitle, chartBoxHeaderOpen);
  const chartBoxBody = gDC("div", "chartBoxBody");

  chartBoxBody.append(chartCanvas);

  chartBox.append(chartBoxHeader, chartBoxBody);

  return { chartBox, chartCanvas };
}

const container = document.getElementById("chartsContainer");


function renderVega(data, elementId) {
  const isOpenAlert =
    data.alerts.filter(alert => {
      return alert.statusId === "SjmOpen";
    }).length > 0;

  const alerts = data.alerts.map(alert => {
    alert.color = alert.statusId === "SjmOpen" ? "#D9534F" : "#5cb85c";
    if(alert.value){
      alert.value = alert.value.toFixed(2);
    }

    if(alert.jobRunId){
      alert.hasLink = true;
      alert.href = "/vapps/system/ServiceJob/JobRuns/JobRunDetail?jobRunId="+alert.jobRunId;
    }else{
      alert.hasLink = false;
      alert.href = "";
    }

    return alert;
  });

  const el = document.getElementById(elementId);

  const layer = [
    {
      data: {
        values: [{ value: data.bounds.lower }, { value: data.bounds.upper }]
      },
      mark: {
        tooltip: null,
        type: "errorband",
        borders: {
          opacity: 0.5,
          strokeDash: [2, 2]
        },
        opacity: 0.1,
        color: isOpenAlert ? "#D9534F" : "#337AB7",
        tooltip: null
      },
      encoding: {
        tooltip: null,
        y: {
          field: "value",
          type: "quantitative",
          title: "Bounds"
        }
      }
    },
    {
      data: { values: data.data },
      mark: {
        type: "line",
        color: isOpenAlert ? "#D9534F" : "#95bad9",
        strokeWidth: 1,
        tooltip: null,
      },
      encoding: {
        x: {
          field: "_source.@timestamp",
          type: "temporal",
          // scale: { domain: { selection: "brush" } },
          axis: {
            title: null,
            grid: false,
            domain: false,
            ticks: false,
            labelPadding: 10,
            tickCount: 5,
            tickExtra: true
          }
        },
        y: {
          field: "_source.value",
          type: "quantitative",
          axis: {
            title: null,
            grid: false,
            domain: false,
            ticks: false,
            labelPadding: 10
          }
        }
      }
    },
    {
      data: { values: alerts },
      mark: {
        opacity: 1,
        type: 'point',
        filled: true,
        cursor: "pointer",
        size: 80,
        tooltip: false
      },
      encoding: {
        href: {field: "href", type: "nominal"},
        shape: {
          condition: {"test": "datum.hasLink", "value": "circle"},
          value: "diamond"
        },
        color: {
          field: "color",
          type: "nominal",
          scale: null
        },
        tooltip: [
          {
            field: "fromDate",
            title: "Start Date",
            type: "temporal",
            formatType: "time",
            format: "%Y %m %d %I:%M %p"
          },
          // {
          //   field: "thruDate",
          //   title: "End Date",
          //   type: "temporal",
          //   formatType: "time",
          //   format: "%Y %m %d %I:%M %p"
          // },
          { field: "value", title: "Value", type: "quantitative" }
        ],
        x: {
          field: "fromDate",
          type: "temporal",
          axis: {
            title: null,
            grid: false,
            domain: false,
            ticks: false,
            labelPadding: 10,
            tickCount: 5,
            tickExtra: true
          }
        },
        y: {
          field: "value",
          type: "quantitative",
          axis: {
            title: null,
            grid: false,
            domain: false,
            ticks: false,
            labelPadding: 10
          }
        }
      }
    }
  ];

  const vconcat = [
    {
      autosize: {
        type: "fit",
        contains: "padding"
      },
      width: el.clientWidth,
      height: 300,
      layer: layer
    },
    {
      data: { values: data.data },
      autosize: {
        type: "fit",
        contains: "padding"
      },
      width: el.clientWidth,
      height: 60,
      mark: {
        tooltip: null,
        type: "line",
        color: isOpenAlert ? "#D9534F" : "#95bad9",
        strokeWidth: 1,
        tooltip: null
      },
      selection: { brush: { type: "interval", encodings: ["x"] } },
      encoding: {
        x: {
          field: "@timestamp",
          type: "temporal",
          axis: {
            title: null,
            grid: false,
            domain: false,
            ticks: false,
            labelPadding: 10,
            tickCount: 5,
            tickExtra: true
          }
        },
        y: {
          field: "value",
          type: "quantitative",
          axis: {
            title: null,
            grid: false,
            domain: false,
            ticks: false,
            labelPadding: 10
          }
        }
      }
    }
  ];

  const yourVlSpec = {
    width: el.clientWidth,
    height: el.clientHeight,
    autosize: {
      type: "fit",
      contains: "padding"
    },
    renderer: "svg",
    description: "A simple bar chart with embedded data.",
    layer: layer,
    config: {
      view: {
        stroke: "transparent"
      }
    }
  };
  const VeOptions = {
    actions: false,
    renderer: "svg"
  };

  vegaEmbed("#" + elementId, yourVlSpec, VeOptions);
}

function makeChart(data) {
  const container = document.getElementById("chartsContainer");

  const isOpenAlert =
    data.alerts.filter(alert => {
      return alert.statusId === "SjmOpen";
    }).length > 0;

  const chart = generateBox({
    name: data.jobName,
    title: data.monitorTitle,
    type: isOpenAlert ? "alertChart" : "",
  });

  container.append(chart.chartBox);

  renderVega(data, data.monitorId);
}

function parseDate(date) {
  // return date.getFullYear() +"-"+(date.getMonth()+1)+"-"+date.getDate()
  return date.toISOString();
}

const DaysOld = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

function changeDate() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  fetchData(startDate, endDate);
}

function setDates(startDate, endDate) {
  startDateInput.value = startDate.toISOString().slice(0, 10);
  endDateInput.value = endDate.toISOString().slice(0, 10);
}

function fetchData(startDate, endDate) {
  const container = document.getElementById("chartsContainer");

  setDates(startDate, endDate);

  fetch(
    "/rest/s1/service-job-monitor/monitors?fromDate=" +
      parseDate(startDate) +
      "&thruDate=" +
      parseDate(endDate)
  )
    .then(function(response) {
      return response.json();
    })
    .then(data => {
      container.innerHTML = "";
      data.value.forEach(makeChart);
    });
}

function fetchSingleChart(monitorId, startDate, endDate) {
  return new Promise((resolve, reject) => {
    fetch(
      "/rest/s1/service-job-monitor/monitors?fromDate=" +
        parseDate(startDate) +
        "&thruDate=" +
        parseDate(endDate) +
        "&monitorId=" +
        monitorId
    )
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        // container.innerHTML = "";
        // data.value.forEach(makeChart)
        resolve(data.value[0]);
      });
  });
}

function renderSideAlerts(data, elementId, countId) {
  const containerElement = document.getElementById(elementId);
  const countElement = document.getElementById(countId);

  countElement.innerText = data.alerts.length;

  const alerts = data.alerts.map(alert => {
    const alertDiv = gDC("div", "sideAlert");

    alertDiv.innerText = moment(alert.fromDate).format("DD MMM, HH:MM a");

    return alertDiv;
  });

  containerElement.append(...alerts);
}

let lastTab = null;

function selectCurrentTab() {
  const currentTab = window.location.pathname.split("/").pop();
  const element = document.getElementById(currentTab);
  if (element) {
    element.className = "tabMenuItem active";
  }

  const dateSelectors = document.getElementById("dateSelectors");
  const topBarMain = document.getElementById("topBarMain");

  if (currentTab === "Charts") {
    dateSelectors.style.display = "block";
  }

  const validTabs = ["Charts", "Alerts", "Monitors"];

  if (validTabs.indexOf(currentTab) === -1 && topBarMain) {
    topBarMain.style.display = "none";
  }
  lastTab = currentTab;
}
// selectCurrentTab();
