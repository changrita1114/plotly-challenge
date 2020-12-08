let getData = function (data, userId = "940") {
    let { metadata, names, samples } = data
    let combinedData = metadata.map((userObject, index) => ({
        ...userObject,
        ...samples[index]
    }))
    let [user] = combinedData.filter(user => user.id === userId)
    let userValues = {
        ...user,
        sample_values: user.sample_values,
        otu_ids: user.otu_ids,
        otu_labels: user.otu_labels,
        wfreq: user.wfreq,
    }

    return userValues;
};

// Build a function to create a bar chart
let buildBarChart = function ({ sample_values, otu_ids, otu_labels }) {
    let trace1 = [{
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(OTU => `OTU ${OTU}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }]

    return Plotly.newPlot("bar", trace1);
}

// Build a function to create a bubble chart
let buildBubbleChart = function ({ sample_values, otu_ids, otu_labels }) {
    let trace2 = [{
        x: otu_ids,
        y: sample_values,
        type: "scatter",
        mode: "markers",
        text: otu_labels,
        marker: {
            color: otu_ids,
            size: sample_values
        }
    }]

    let layout = {
        showlegend: false,
        height: 600,
        width: 1300
    };

    return Plotly.newPlot("bubble", trace2, layout);
}

// Build a function to create a gauge chart
let buildGaugeChart = function ({ wfreq }) {
    let trace3 = {
        type: "pie",
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81 / 9, 81],
        text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
            colors: ["#fff9e6", "#fff2cc", "#ddddbb", "#c3c388", "#88cc00",
                "#669900", "#339933", "#2d862d", "#267326", "white"],
        },
    };
    let degrees = (180 - wfreq), radius = .5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    let layout = {
        width: 600,
        height: 500,
        shapes: [{
            type: 'line',
            x0: 0.5,
            y0: 0.5,
            x1: x,
            y1: y,
            line: {
                color: 'darkred',
                width: 5
            }
        }],
        title: "Belly Button Washing Frequency Scrubs per week",
        // xaxis: { visible: false, range: [-1, 1] },
        // yaxis: { visible: false, range: [-1, 1] }
    };

    var chartData = [trace3];
    return Plotly.newPlot("gauge", chartData, layout);

}
// Build a function to claer demographic info box
let clearMetadata = function () {
    document.getElementById("sample-metadata").innerHTML = ""
};

// Build a function to create table
let buildTable = function ({ id, ethnicity, gender, age, location, bbtype, wfreq }) {
    return d3.select("#sample-metadata")
        .selectAll("div")
        .data([{ id }, { ethnicity }, { gender }, { age }, { location }, { bbtype }, { wfreq }])
        .enter()
        .append("div")
        .html(function (d) {
            return `<table><tr><td>${Object.entries(d)[0].join(': ')}</td></tr></table>`
        });
};


// Build a function to dropdown
let dropDown = function (names) {
    d3.select("#selDataset")
        .selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .text(d => d)
};

// Submit Button handler
let optionChanged = function (id) {
    d3.json("data/samples.json").then(data => {
        let userData = getData(data, id)
        buildBarChart(userData)
        buildBubbleChart(userData)
        buildGaugeChart(userData)
        clearMetadata()
        buildTable(userData)
    })
};

// Build a function to render the page
let renderPage = function () {
    d3.json("data/samples.json").then(data => {
        let userData = getData(data)
        buildBarChart(userData)
        buildBubbleChart(userData)
        buildGaugeChart(userData)
        dropDown(data.names)
        buildTable(userData)
    })
};

document.addEventListener("DOMContentLoaded", renderPage)