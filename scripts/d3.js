svg = d3.select('#svgContent')
width = +svg.attr('width');
height = +svg.attr('height');


function updateGraph (nodes, links) {
    const codeNoToSlack = {};
    pertEntry.forEach(task => {
        codeNoToSlack[task.codeNo] = task.slack
    })

    links.forEach(link => {
        link.slack = codeNoToSlack[link.target]
    })

    const startNode = graph.nodes.find(node => node.id === "start")
    const finishNode = graph.nodes.find(node => node.id === "finish")

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

    let simulation = d3.forceSimulation(graph.nodes)
        .force('link', d3.forceLink(graph.links)
            .id(function (d)    { return d.id; })
            .distance(d => {
                if (d.slack !== undefined && d.slack !== 0) {
                    return 120 + (d.slack * 30)
                }
                return 120
            })
        )
        .force('charge', d3.forceManyBody().strength(-1600))
        .force("center", d3.forceCenter(width / 2.5, height / 2))
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
        .style('stroke', d => allCriticalPaths.includes(d) ? "red" : "black")

    const textsAndNodes = svg
        .append('g')
        .selectAll('g')
        .data(graph.nodes)
        .enter().append("g")
        .attr('class', 'node')
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

    const lastElement = graph.nodes[graph.nodes.length - 1]
    const secondToLastElement = graph.nodes[graph.nodes.length - 2]

    let darkBackground = textsAndNodes
        .append('path')
        .attr("d", d => {
            if(d.index === lastElement.index || d.index === secondToLastElement.index ) {
                return "M 10 0H 90C 95.5228 0 100 4.47715 100 10V 40C 100 45.5228 95.5228 50 90 50H 10C 4.47715 50 0 45.5228 0 40V 10C 0 4.47715 4.47715 0 10 0Z "
            } else {
                return "M0 10C0 4.47715 4.47715 0 10 0H33.33V25.5H0V10Z"
            }

        })
        .attr("fill", "#101423")

    let activity = textsAndNodes
        .append("text")
        .text(d => d.name)
        .attr('x', function(d) {
            if (d.id === lastElement.id || d.id === secondToLastElement.id) {
                return 26; // Center x position
            }
            return 12; // Default x position
        })
        .attr('y', function(d) {
            if (d.id === lastElement.id || d.id === secondToLastElement.id) {
                return 28; // Center y position
            }
            return 18; // Default y position
        })

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
        .style("stroke", "#101423")
        .style("stroke-width", 2)
        .style("display", d => (d.id === lastElement.id || d.id === secondToLastElement.id) ? "none" : "inline");

    let verticalPartition1 = textsAndNodes
        .append('line')
        .attr("x1", 33.33)
        .attr("x2", 33.33)
        .attr("y1", 50)
        .attr("y2", 0)
        .style("stroke", "#101423")
        .style("stroke-width", 2)
        .style("display", d => (d.id === lastElement.id || d.id === secondToLastElement.id) ? "none" : "inline");

    let verticalPartition2 = textsAndNodes
        .append('line')
        .attr("x1", 66.66)
        .attr("x2", 66.66)
        .attr("y1", 50)
        .attr("y2", 0)
        .style("stroke", "#101423")
        .style("stroke-width", 2)
        .style("display", d => (d.id === lastElement.id || d.id === secondToLastElement.id) ? "none" : "inline");

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
}

updateGraph(nodes, links)