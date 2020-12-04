// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
    // console.log(importedData);
    let data = importedData;
    let sortedBySampleValues = data.samples.sort((a, b) => b.sample_values - a.sample_values);
    // console.log(sortedBySampleValues)

    // Slice the first indivisual for plotting
    let slicedSamples = sortedBySampleValues[0].sample_values.slice(0, 10);
    // console.log(slicedSamples)
    let slicedID = sortedBySampleValues[0].otu_ids.slice(0, 10);
    // console.log(slicedID)
    let slicedLabel = sortedBySampleValues[0].otu_labels.slice(0, 10);
    // console.log(slicedLabel)

    d3.select("#selDataset")
        .selectAll("option")
        .data(data.names)
        .enter().append('option').text(id => id)

    d3.select("#sample-metadata").data(data.metadata)

    // Trace1 for the Greek Data
    let trace1 = {
        x: slicedSamples.reverse(),
        y: slicedID.map(OTU => `OTU ${OTU}`).reverse(),
        text: slicedLabel,
        name: "OTU",
        type: "bar",
        orientation: "h"
    };
    let trace2 = {
        x: slicedID,
        y: slicedSamples,
        text: slicedLabel,
        mode: 'markers',
        // marker: {
        //     size: [slicedSamples.map(item => item)]
        // }
    };
     
    console.log(slicedSamples.map(item => item))

    // data
    let chartData = [trace1];
    let chartData_2 = [trace2];

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData);
    Plotly.newPlot("bubble", chartData_2);
    // Plotly.newPlot("gauge", chartData_3, layout);
});

function optionChanged(val) {
    console.log(val);
}
