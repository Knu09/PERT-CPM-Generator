svg = d3.select('#svgContent')
width = +svg.attr('width');
height = +svg.attr('height');

function displayGraph (nodes, links) {
    // Clear existing elements in the Network Graph before redrawing.
    svg.selectAll('*').remove();

    const codeNoToSlack = {};
    pertEntry.forEach(task => {
        codeNoToSlack[task.codeNo] = task.slack
    })

    links.forEach(link => {
        link.slack = codeNoToSlack[link.target]
    })

    const startNode = nodes.find(node => node.id === "start")
    const finishNode = nodes.find(node => node.id === "finish")

// Identify the Critical Path Links
    const criticalPathLinks = links.filter (link => {
        const sourceTask = pertEntry.find(task => task.codeNo === link.source);
        const targetTask = pertEntry.find(task => task.codeNo === link.target);
        return sourceTask && targetTask && sourceTask.slack === 0 && targetTask.slack === 0;
    })

    const startFinishBoundaries = () => {
        const additionalLinks = []
        // Finding the critical path from start node
        if (startNode) {
            links.forEach(link => {
                if (link.source === startNode.id) {
                    const targetTask = pertEntry.find(task => task.codeNo === link.target)
                    if (targetTask && targetTask.slack === 0) {
                        additionalLinks.push(link);
                    }
                }
            })
        }

        // Finding the critical path from finish node
        if (finishNode) {
            links.forEach(link => {
                if (link.target === finishNode.id) {
                    const sourceTask = pertEntry.find(task => task.codeNo === link.source)
                    if (sourceTask && sourceTask.slack === 0) {
                        additionalLinks.push(link);
                    }
                }
            })
        }
        return additionalLinks;
    }

    const startFinishSlackLinks = startFinishBoundaries();
    const allCriticalPaths = [...criticalPathLinks, ...startFinishSlackLinks]

// Panning and zooming

    const main = (({state, setState}) => {
        const zoomBehavior = d3.zoom().on("zoom", (event) => {
            console.log(event.transform);
            setState((state) => ({
                ...state,
                transform: event.transform,
            }))
        })

        svg.call(zoomBehavior)

        const { transform } = state;

        const g = svg
            .selectAll('svg')
            .data([null])
            .join('g')

        g.attr('transform', transform)

    })

    let simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links)
            .id( d => d.id)
            .distance(d => {
                if (d.slack !== undefined && d.slack !== 0) {
                    return 120 + (d.slack * 30)
                }
                return 120
            })
        )
        .force('charge', d3.forceManyBody().strength(-1800))
        .force("center", d3.forceCenter(width / 2.5, height / 2))
        .force('x', d3.forceX()) // optional: horizontal positioning
        .force('y', d3.forceY()) // optional: vertical positioning
        .on('tick', ticked);

    // Link elements
    let link = svg.selectAll('.link')
        .data(links, d => `${d.source.id}-${d.target.id}`);

    link = svg
        .append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-width', 2)
        .style('stroke', d => allCriticalPaths.includes(d) ? "red" : "black")

    link.exit().remove();

    // Node Elements
    let node = svg.selectAll(".node")
        .data(nodes, d => d.id)

    const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')

        // call drag simulation function
        .call(drag(simulation))

    nodeEnter
        .append('rect')
        .attr('class', "nodes")
        .attr('width', () => 100)
        .attr('height', () => 50)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'white')
        .attr("stroke-width", 2)
        .attr("stroke", () => 'black')

    nodeEnter
        .append('path')
        .attr('class', 'darkBackground')
        .attr("d", d => d.index === nodes.length - 1 || d.index === nodes.length - 2 ?
            "M 10 0H 90C 95.5228 0 100 4.47715 100 10V 40C 100 45.5228 95.5228 50 90 50H 10C 4.47715 50 0 45.5228 0 40V 10C 0 4.47715 4.47715 0 10 0Z " :
            "M0 10C0 4.47715 4.47715 0 10 0H33.33V25.5H0V10Z")
        .attr("fill", "#101423")

    nodeEnter
        .append("text")
        .attr('class', 'activity')
        .text(d => d.name)
        .attr('x', d => d.id === nodes[nodes.length - 1].id || d.id === nodes[nodes.length - 2].id ? 26 : 12)
        .attr('y', d => d.id === nodes[nodes.length - 1].id || d.id === nodes[nodes.length - 2].id ? 28 : 18)
        .style('fill', "white")
        .style('z-index', 100)

    nodeEnter
        .append("text")
        .attr('class', 'estimatedTime')
        .data(pertEntry)
        .text(d => d.ET)
        .attr('x', 12)
        .attr('y', 43)

    nodeEnter
        .append("text")
        .attr('class', 'earlyStart')
        .data(pertEntry)
        .text(d => d.ES)
        .attr('x', 43)
        .attr('y', 18)

    nodeEnter
        .append("text")
        .attr('class', 'earlyFinish')
        .data(pertEntry)
        .text(d => d.EF)
        .attr('x', 76)
        .attr('y', 18)

    nodeEnter
        .append("text")
        .attr('class', 'latestStart')
        .data(pertEntry)
        .text(d => d.LS)
        .attr('x', 43)
        .attr('y', 43)

    nodeEnter
        .append("text")
        .attr('class', 'latestFinish')
        .data(pertEntry)
        .text(d => d.LF)
        .attr('x', 76)
        .attr('y', 43)


    nodeEnter
        .append('line')
        .attr('class', 'horizontalPartition')
        .attr("x1", 0)
        .attr("x2", 100)
        .attr("y1", 26)
        .attr("y2", 26)
        .style("stroke", "#101423")
        .style("stroke-width", 2)
        .style('display', d => d.id === nodes[nodes.length - 1].id || d.id === nodes[nodes.length - 2].id ? 'none' : 'inline');


    nodeEnter
        .append('line')
        .attr('class', 'verticalPartition1')
        .attr("x1", 33.33)
        .attr("x2", 33.33)
        .attr("y1", 50)
        .attr("y2", 0)
        .style("stroke", "#101423")
        .style("stroke-width", 2)
        .style('display', d => d.id === nodes[nodes.length - 1].id || d.id === nodes[nodes.length - 2].id ? 'none' : 'inline');

    nodeEnter
        .append('line')
        .attr('class', 'verticalPartition2')
        .attr("x1", 33.33)
        .attr("x2", 33.33)
        .attr("y1", 50)
        .attr("y2", 0)
        .style("stroke", "#101423")
        .style("stroke-width", 2)
        .style('display', d => d.id === nodes[nodes.length - 1].id || d.id === nodes[nodes.length - 2].id ? 'none' : 'inline');

    node = node.merge(nodeEnter)

    node.exit().remove()

    console.log(graph.links)
    console.log(links)
    function ticked() {



        link
            .data(links)
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node
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
}

displayGraph(window.nodes, window.links)
