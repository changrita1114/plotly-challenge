// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument
d3.json("data/samples.json").then((importedData) => {
    // console.log(importedData);
    let data = importedData;
    let sortedBySampleValues = data.samples.sort((a, b) => b.sample_values - a.sample_values);
    console.log(sortedBySampleValues)
    // Slice the first indivisual for plotting
    slicedData = sortedBySampleValues.slice(0, 1);
    console.log(slicedData)
    // Reverse the array to accommodate Plotly's defaults
    reversedData = slicedData.reverse();
    console.log(reversedData);
  
    let x = reversedData.map(object => object.sample_values);
    console.log(x);
    let x_sliced = x.slice(0, 10);
     console.log(x_sliced);
    // let x=[];
    // let y=[];
    
    // let test_1 = reversedData.map(recipe => recipe.x);
    // let test_2 = reversedData.map(recipe => recipe.y);
    // console.log(test_1)
    // console.log(test_2)


    // Trace1 for the Greek Data
    let trace1 = {
        x: reversedData.map(object => object.sample_values[0]),
        y: reversedData.map(object => object.otu_ids[0]),
        text: reversedData.map(object => object.otu_labels[0]),
        name: "OTU",
        type: "bar",
        orientation: "h"
    };


    // //data
    // let chartData = [trace1, trace2];
    let chartData = [trace1];
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
    // Plotly.newPlot("bubble", chartData);
    // Plotly.newPlot("gauge", chartData, layout);
    
    // Save this info for later part
    console.log(data.names)
});

