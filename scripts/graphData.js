const graph = {
    nodes: [
        { id: 1,name: "A"},
        { id: 2, name: "B"},
        { id: 3, name: "C"},
        { id: 4, name: "D"},
        { id: 5, name: "E"}

    ],
    links: [
        { source: 1, target: 2},
        { source: 1, target: 3},
        { source: 4, target: 1},
        { source: 4, target: 2},
        { source: 5, target: 4}
    ]
}
