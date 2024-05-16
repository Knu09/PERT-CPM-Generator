// let dataset = [80, 120, 56, 42, 57, 156, 73, 124]
//
// d3.select('body')
//     .selectAll('p')
//     .data(dataset)
//     .enter()
//     .append('p')
//     .text(function(d) {
//         return d;
//     })
//
// let svgWidth = 500, svgHeight = 300, barPadding = 5;
// let barWidth = (svgWidth / dataset.length);
//
// let svg = d3.select('svg')
//     .attr("width", svgWidth)
//     .attr("height", svgHeight)
//
// let barChart = svg.selectAll("rect")
//     .data(dataset)
//     .enter()
//     .append("rect")
//     .attr("cx", (d, i) => i * 120 + 60)
//     .attr("y", function(d) {
//         return svgHeight - d
//     })
//     .attr("height", function(d) {
//         return d;
//     })
//     .attr("width", barWidth - barPadding)
//     .attr("transform", function (d, i) {
//         let translate = [barWidth + i, 0];
//         return "translate(" + translate +")";
//     })
//
// // FRUITS
// import {select, rnage} from 'd3'
//
