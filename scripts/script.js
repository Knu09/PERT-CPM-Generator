function checkPredecessor(task) {
    return task.predecessor.length === 0 ? "None" : task.predecessor
}

const findTaskByCode = code => pertEntry.find(task => task.code === code)
// Calculation of Forward Pass

let pertHTML = '';

function calculatePertValues(pertEntry) {

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

        // Computation for Backward Pass
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

        // Computation for Slack
        pertEntry.forEach(task => {
            task.slack = Math.abs(task.LS - task.ES);
        })
    })
}

function forceDataReload() {
    calculatePertValues(pertEntry)
    updateDisplayedValues()
    updateNodesAndLinks()
}

function addActivity(task) {
    pertEntry.push({
        code: '',
        description: '',
        predecessor: [],
        a: 0,
        m: 0,
        b: 0,
        ET: 0,
        ES: 0,
        EF: 0,
        LS: 0,
        LF: 0,
        slack: 0
    });

    pertHTML += `
    <tr class="PERT-row">
      <td>${task.length}</td>
      <td><input data-index="${task.length - 1}" class="input task-input" type="text" placeholder="--"></td>
      <td><input data-index="${task.length - 1}" class="input description-input" type="text" placeholder="Empty"></td>
      <td><input data-index="${task.length - 1}" class="input predecessor-input" type="text" placeholder="--"></td>
      <td><input data-index="${task.length - 1}" placeholder="0" class="input time-variability time-variability-a" /> </td>
      <td><input data-index="${task.length - 1}" placeholder="0" class="input time-variability time-variability-m" /> </td>
      <td><input data-index="${task.length - 1}" placeholder="0" class="input time-variability time-variability-b" /> </td>
      <td>0</td>
      <td class="earliest-start">0</td>
      <td class="earliest-finish">0</td>
      <td class="latest-start">0</td>
      <td class="latest-finish">0</td>
      <td class="slack">0</td>
    </tr>
  `;
    document.querySelector('.PERT-body').innerHTML = pertHTML;
    inputEvents();
    calculatePertValues(pertEntry)
    updateNodesAndLinks()
    forceDataReload(false)
}

function updateDisplayedValues(shouldReload = true) {

    pertHTML = ``;

    pertEntry.forEach((task, i) => {
        pertHTML += `
    <tr class="PERT-row">
        <td>${i + 1}</td>
        <td><input data-index="${i}" class="input task-input" value="${task.code}" type="text" placeholder="--"></td>
        <td><input data-index="${i}" class="input description-input" value="${task.description}" type="text" value="Empty"></td>
        <td><input data-index="${i}" class="input predecessor-input" value="${checkPredecessor(task)}" type="text" placeholder="--"></td>
        <td><input data-index="${i}" value="${task.a}" class="input time-variability time-variability-a" /> </td>
        <td><input data-index="${i}" value="${task.m}" class="input time-variability time-variability-m" /> </td>
        <td><input data-index="${i}" value="${task.b}" class="input time-variability time-variability-b" /> </td>
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
    if (shouldReload) {
        inputEvents()
    }
}

function inputEvents() {
    const allInputs = document.querySelectorAll('input')
    allInputs.forEach(input => {
        input.addEventListener('change', (event, i) => {
            const taskIndex = parseInt(event.target.dataset.index);

            if (input.classList.contains('time-variability-a')) {
                pertEntry[taskIndex].a = parseFloat(event.target.value);
            } else if (input.classList.contains('time-variability-m')) {
                pertEntry[taskIndex].m = parseFloat(event.target.value);
            } else if (input.classList.contains('time-variability-b')) {
                pertEntry[taskIndex].b = parseFloat(event.target.value);
            } else if (input.classList.contains('task-input')) {
                pertEntry[taskIndex].code = event.target.value
            } else if (input.classList.contains('description-input')) {
                pertEntry[taskIndex].description = event.target.value
            } else if (input.classList.contains('predecessor-input')) {
                pertEntry[taskIndex].predecessor = event.target.value
            }
            calculatePertValues(pertEntry)
            updateNodesAndLinks()
            updateDisplayedValues()
        })
    })
}

function updateNodesAndLinks () {
    const nodes = pertEntry.map(task => ({
        id: task.codeNo,
        name: task.code
    }))

// Adding "start" and "Finish" nodes
    nodes.push({id: "start", name: "Start"});
    nodes.push({id: "finish", name: "Finish"});

// Converting Task Code to an ID
    const codeToId = {}
    pertEntry.forEach(task => {
        codeToId[task.code] = task.codeNo
    })

// Linking a node to a target
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
        if (!nodeIdsWithSuccessors.has(task.codeNo)) {
            links.push({
                source: task.codeNo,
                target: "finish"
            })
        }
    })

// update for the global variable
    window.nodes = nodes;
    window.links = links;

}

calculatePertValues(pertEntry)
updateDisplayedValues()
updateNodesAndLinks()

// button selectors
const addActivityBtn = document.querySelector(".add-button")
const forceReloadData = document.querySelector(".update-button")

addActivityBtn.addEventListener('click', addActivity)
forceReloadData.addEventListener('click', forceDataReload)

