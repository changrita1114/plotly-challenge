// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
    console.log(importedData);
    let data = importedData;

    // Sort the data array using OTUs
    data.sort(function (a, b) {
        return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    });

    // Slice the first 10 objects for plotting
    data = data.slice(0, 10);

    // Reverse the array due to Plotly's defaults
    data = data.reverse();

    // Trace1 for the OTU Data
    let trace1 = {
        x: data.map(row => row.sample_values),
        y: data.map(row => row.otu_ids),
        text: data.map(row => row.otu_labels),
        name: "OTU",
        type: "bar",
        orientation: "h"
    };

    // Trace2 for bubble chart
    let trace2 = {
        x: data.map(row => row.sample_values),
        y: data.map(row => row.otu_ids),
        text: data.map(row => row.otu_labels),
        mode: 'markers',
        name: "OTU",
        orientation: "h"
    };

    // data
    let chartData = [trace1,trace2];

    // Apply the group bar mode to the layout
    // let layout = {
    //     title: "OTU results",
    //     margin: {
    //         l: 100,
    //         r: 100,
    //         t: 100,
    //         b: 100
    //     }
    // };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData);
    Plotly.newPlot("bubble", chartData);
    // Plotly.newPlot("gauge", chartData, layout);
});