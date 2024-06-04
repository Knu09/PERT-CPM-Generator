function checkPredecessor(task) {
    return task.predecessor.length === 0 ? "None" : task.predecessor
}
const findTaskByCode = code => pertEntry.find(task => task.code === code)
// Calculation of Forward Pass

let pertHTML = '';
pertEntry.forEach(task => {

    // Computation for Expected Time.
    task.ET = Math.round((task.a + (4 * task.m) + task.b) / 6);

    // Computation for Forward Pass
    if (task.predecessor.length === 0) {
        task.ES = 0;
    } else {
        task.ES = Math.max(...task.predecessor.map(code => {
            const predTask = findTaskByCode(code);
            return predTask ? predTask.EF : 0;
        }))
    }
    task.EF = task.ES + task.ET;

    const maxEF = Math.max(...pertEntry.map(task => task.EF))
    pertEntry.slice().reverse().forEach(task => {
        if (pertEntry.every(t => !t.predecessor.includes(task.code))) {
            task.LF = maxEF;
        } else {
            task.LF = Math.min(...pertEntry
                .filter(t => t.predecessor.includes(task.code))
                .map(t => t.LS))

        }
        task.LS = task.LF - task.ET;
    })

    pertEntry.forEach(task => {
        task.slack = Math.abs(task.LS - task.ES);
    })
})

const activityNo = document.querySelectorAll('.activityNo')
pertEntry.forEach((task, i) => {
    activityNo.innerText = `${i + 1}`
    pertHTML += `
    <tr>
        <td><input value="${i + 1}" /></td>
        <td>${task.code}</td>
        <td>${task.description}</td>
        <td>${checkPredecessor(task)}</td>
        <td>${task.a}</td>
        <td>${task.m}</td>
        <td>${task.b}</td>
        <td>${task.ET}</td>
        <td class="earliest-start">${task.ES}</td>
        <td class="earliest-finish">${task.EF}</td>
        <td class="latest-start">${task.LS}</td>
        <td class="latest-finish">${task.LF}</td>
        <td class="slack">${task.slack}</td>
    </tr>
    `
})
document.querySelector('.PERT-body').innerHTML = pertHTML;

const nodes = pertEntry.map(task => ({
    id: task.codeNo,
    name: task.code
}))

// Adding "start" and "Finish" nodes
nodes.push({ id: "start", name: "Start"});
nodes.push({ id: "finish", name: "Finish"});

const codeToId = {}
pertEntry.forEach(task => {
    codeToId[task.code] = task.codeNo
})

const links = []
pertEntry.forEach(task => {
    task.predecessor.forEach(pre => {
        links.push({
            source: codeToId[pre],
            target: task.codeNo
        })
    })
})

pertEntry.forEach(task => {
    if (task.predecessor.length === 0) {
        links.push({
            source: 'start',
            target: task.codeNo
        })
    }
})

const nodeIdsWithSuccessors = new Set();
pertEntry.forEach(task => {
    task.predecessor.forEach(pre => {
        nodeIdsWithSuccessors.add(codeToId[pre])
    })
})
pertEntry.forEach(task => {
    if(!nodeIdsWithSuccessors.has(task.codeNo)) {
        links.push({
            source: task.codeNo,
            target: "finish"
        })
    }
})


