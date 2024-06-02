const pertEntry = [
    {
        codeNo: 1,
        code: "A",
        predecessor: [],
        a: 2,
        m: 3,
        b: 4,
    },
    {
        codeNo: 2,
        code: "B",
        predecessor: [],
        a: 3,
        m: 7,
        b: 7,
    },
    {
        codeNo: 3,
        code: "C",
        predecessor: ["A", "B"],
        a: 1,
        m: 2,
        b: 3,
    },
    {
        codeNo: 4,
        code: "D",
        predecessor: ["C"],
        a: 1,
        m: 3,
        b: 15,
    },
    {
        codeNo: 5,
        code: "E",
        predecessor: ["C"],
        a: 2,
        m: 3,
        b: 9,
    },
    {
        codeNo: 6,
        code: "F",
        predecessor: ["D", "E"],
        a: 0,
        m: 4,
        b: 4,
    },
    {
        codeNo: 7,
        code: "G",
        predecessor: ["E"],
        a: 6,
        m: 8,
        b: 15,
    },
    {
        codeNo: 8,
        code: "H",
        predecessor: ["F", "G"],
        a: 2,
        m: 2,
        b: 7,
    }
]