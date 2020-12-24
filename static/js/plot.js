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
    let layout = {
        title: "<b>Top 10 Bacteria Cultures Found</b>",
        margin: { t: 30, l: 150 }
    };
    return Plotly.newPlot("bar", trace1, layout);
}

// Build a function to create a bubble chart
let buildBubbleChart = function ({ sample_values, otu_ids, otu_labels }) {
    let trace2 = [{
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        text: otu_labels,
        marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: "Earth"
        }
    }]

    let layout = {
        title: "<b>Bacteria Cultures Per Sample</b>",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30 }
    };

    return Plotly.newPlot("bubble", trace2, layout);
}

// Build a function to create a gauge chart
let buildGaugeChart = function ({ wfreq }) {
    // Enter the washing frequency between 0 and 180
    let level = parseFloat(wfreq) * 20;

    // Trig to calc meter point
    let degrees = 180 - level;
    let radius = .5;
    let radians = (degrees * Math.PI) / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    let mainPath = "M -.0 -0.05 L .0 0.05 L "
    let pathX = String(x);
    let space = " ";
    let pathY = String(y);
    let pathEnd = " Z";
    let path = mainPath.concat(pathX, space, pathY, pathEnd)


    let trace3 = [
        {
            x: [0], y: [0],
            type: "scatter",
            marker: { size: 12, color: "850000" },
            showlegend: false,
            name: "Freq",
            text: level,
            hoverinfo: "text+name",
        },
        {
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
            labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
        }
    ];

    let layout = {
        width: 500,
        height: 500,
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: "850000",
            line: {
                color: "850000"
            }
        }],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per week",
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
    };

    // var chartData = [trace3];
    return Plotly.newPlot("gauge", trace3, layout);

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

// Build a function to render the preview of the page
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