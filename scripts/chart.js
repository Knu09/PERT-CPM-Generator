svg = d3.select('#svgContent')
width = +svg.attr('width');
height = +svg.attr('height');


let simulation = d3.forceSimulation(graph.nodes)
    .force('link', d3.forceLink(graph.links)
        .id(function (d) { return d.id; })
        .distance(150)
    )
    .force('charge', d3.forceManyBody().strength(-3000))
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
    .attr('width', () => 100)
    .attr('height', () => 50)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', function(d) {
        return 'white';
    })
    .attr("stroke-width", 3)
    .attr("stroke", () => 'black')


let texts = textsAndNodes
    .append("text")
    .text(d => d.name)

function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    textsAndNodes
        .attr("transform", d => 'translate(' + (d.x - 50) + ", " + (d.y - 20) + ")")


    // node
    //     .attr("x", function (d) { return d.x - 50; })
    //     .attr("y", function(d) { return d.y - 20; });
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
