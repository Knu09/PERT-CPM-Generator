svg = d3.select('#svgContent')
width = +svg.attr('width');
height = +svg.attr('height');


let simulation = d3.forceSimulation(graph.nodes)
    .force('link', d3.forceLink(graph.links)
        .id(function (d) { return d.id; })
        .distance(120)
    )
    .force('charge', d3.forceManyBody().strength(-1500))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX()) // optional: horizontal positioning
    .force('y', d3.forceY()) // optional: vertical positioning
    .on('tick', ticked);

const link = svg
    .append('g')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('stroke-width', 2)
    .style('stroke', 'black')

const textsAndNodes = svg
    .append('g')
    .selectAll('g')
    .data(graph.nodes)
    .enter().append("g")
    .call(drag(simulation))

let node = textsAndNodes
    .append('rect')
    .attr('class', "nodes")
    .attr('width', () => 100)
    .attr('height', () => 50)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', function(d) {
        return 'white';
    })
    .attr("stroke-width", 2)
    .attr("stroke", () => 'black')


let darkBackground = textsAndNodes
    .append('path')
    .attr("d", "M0 10C0 4.47715 4.47715 0 10 0H33.33V25.5H0V10Z")
    .attr("fill", "#101423")

let activity = textsAndNodes
    .append("text")
    .text(d => d.name)
    .attr('x', 12)
    .attr('y', 18)
    .style('fill', "white")
    .style('z-index', 100)

let estimatedTime = textsAndNodes
    .append("text")
    .data(pertEntry)
    .text(d => d.ET)
    .attr('x', 12)
    .attr('y', 43)

let earlyStart = textsAndNodes
    .append("text")
    .data(pertEntry)
    .text(d => d.ES)
    .attr('x', 43)
    .attr('y', 18)

let earlyFinish = textsAndNodes
    .append("text")
    .data(pertEntry)
    .text(d => d.EF)
    .attr('x', 76)
    .attr('y', 18)

let latestStart = textsAndNodes
    .append("text")
    .data(pertEntry)
    .text(d => d.LS)
    .attr('x', 43)
    .attr('y', 43)

let latestFinish = textsAndNodes
    .append("text")
    .data(pertEntry)
    .text(d => d.LF)
    .attr('x', 76)
    .attr('y', 43)


let horizontalPartition = textsAndNodes
    .append('line')
    .attr("x1", 0)
    .attr("x2", 100)
    .attr("y1", 26)
    .attr("y2", 26)
    .style("stroke", "black")
    .style("stroke-width", 2)

let verticalPartition1 = textsAndNodes
    .append('line')
    .attr("x1", 33.33)
    .attr("x2", 33.33)
    .attr("y1", 50)
    .attr("y2", 0)
    .style("stroke", "black")
    .style("stroke-width", 2)

let verticalPartition2 = textsAndNodes
    .append('line')
    .attr("x1", 66.66)
    .attr("x2", 66.66)
    .attr("y1", 50)
    .attr("y2", 0)
    .style("stroke", "black")
    .style("stroke-width", 2)

// let startNode = svg
//     .append('rect')
//     .attr('class', "nodes")
//     .attr('width', () => 60)
//     .attr('height', () => 40)
//     .attr('rx', 10)
//     .attr('ry', 10)
//     .attr('fill', function(d) {
//         return 'white';
//     })
//     .attr("stroke-width", 2)
//     .attr("stroke", () => 'black')

function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    textsAndNodes
        .attr("transform", d => 'translate(' + (d.x - 50) + ", " + (d.y - 20) + ")")

}
function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

simulation.restart()
