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
        pertEntry.forEach((task, i) => {
            task.slack = Math.abs(task.EF - task.LF);
            if (task.slack === 0) {
                task.criticalPath = true;
            } else {
                task.criticalPath = false;
            }
        })
    })
}

function forceDataReload() {
    calculatePertValues(pertEntry)
    updateDisplayedValues()
    updateNodesAndLinks()
    displayGraph(window.nodes, window.links)
}

function removeAllData () {
    pertEntry.length = 0
    pertHTML = ``
    pertEntry.push({
        codeNo: 1,
        code: 'A',
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
          <td>${pertEntry.codeNo}</td>
          <td><input data-index="${pertEntry.length - 1}" class="input task-input" type="text" placeholder="--" value="A"></td>
          <td><input data-index="${pertEntry.length - 1}" class="input description-input" type="text" placeholder="Empty"></td>
          <td><input data-index="${pertEntry.length - 1}" class="input predecessor-input" type="text" placeholder="--"></td>
          <td><input data-index="${pertEntry.length - 1}" placeholder="0" class="input time-variability time-variability-a" /> </td>
          <td><input data-index="${pertEntry.length - 1}" placeholder="0" class="input time-variability time-variability-m" /> </td>
          <td><input data-index="${pertEntry.length - 1}" placeholder="0" class="input time-variability time-variability-b" /> </td>
          <td class="estimated-time">0</td>
          <td class="earliest-start">0</td>
          <td class="earliest-finish">0</td>
          <td class="latest-start">0</td>
          <td class="latest-finish">0</td>
          <td class="slack">0</td>
        </tr>
  `;
    document.querySelector('.PERT-body').innerHTML = pertHTML;

    window.nodes = []
    window.link = []
    //
    // graph.nodes.length = 0
    // graph.links.length = 0
    //
    updateDisplayedValues()
    updateNodesAndLinks()
    displayGraph(nodes, links)
}

function addActivity(task) {
    const newCode = String.fromCharCode(65 + task.length - 1)
    pertEntry.push({
        codeNo: task.length + 1,
        code: newCode,
        description: '',
        predecessor: [],
        a: 4,
        m: 3,
        b: 2,
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
      <td class="estimated-time">0</td>
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

    displayGraph(window.nodes, window.links)
    console.log(nodes, links)

}

function updateDisplayedValues(shouldReload = true) {
    pertHTML = ``;

    pertEntry.forEach((task, i) => {
        pertHTML += `
    <tr class="PERT-row">
        <td>${i + 1}</td>
        <td><input data-index="${i}" class="input task-input" value="${task.code}" type="text" placeholder="--"></td>
        <td><input data-index="${i}" class="input description-input" value="${task.description}" type="text" placeholder="Empty"></td>
        <td><input data-index="${i}" class="input predecessor-input" value="${checkPredecessor(task)}" type="text" placeholder="--"></td>
        <td><input data-index="${i}" value="${task.a}" class="input time-variability time-variability-a" /> </td>
        <td><input data-index="${i}" value="${task.m}" class="input time-variability time-variability-m" /> </td>
        <td><input data-index="${i}" value="${task.b}" class="input time-variability time-variability-b" /> </td>
        <td class="estimated-time">${task.ET}</td>
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


// Input and Error handling
function inputEvents() {
    const allInputs = document.querySelectorAll('input')
    allInputs.forEach(input => {
        let previousValue = input.value;

        input.addEventListener('change', (event, i) => {
            const taskIndex = parseInt(event.target.dataset.index);

            function validateVariablity (inputClass, value) {
                const floatValue = parseFloat(value);
                if (floatValue > -1 && floatValue < 100) {
                    pertEntry[taskIndex][inputClass] = floatValue
                } else if (isNaN(floatValue)) {
                    alert(`Variability Value should be a number!`)
                } else {
                    alert(`Invalid variability value: ${floatValue}. Variability values cannot be negative or greater than 100.`);
                }
            }
            if (input.classList.contains('time-variability-a')) {
                validateVariablity('a', event.target.value)
            } else if (input.classList.contains('time-variability-m')) {
                validateVariablity('m', event.target.value)
            } else if (input.classList.contains('time-variability-b')) {
                validateVariablity('b', event.target.value)
            } else if (input.classList.contains('task-input')) {
                const taskArr = event.target.value.replace(/\s/g, '').toUpperCase();
                if (taskArr.length < 1) {
                    alert(`Please insert a task in No. ${taskIndex + 1}`)
                } else if (taskArr.length > 2) {
                    alert(`Invalid task code: ${taskArr.join('')}. Task codes must be up to 2 characters in length.`)
                } else {
                    const hasMatchingPred = pertEntry.some(task => task.predecessor.includes(previousValue));
                    const hasMatchingTask = pertEntry.some(task => task.code.includes(taskArr))
                    if (hasMatchingTask) {
                        alert(`The task code ${taskArr} is already in use.`);
                    } else {
                        if (hasMatchingPred) {
                            pertEntry.forEach(task => {
                                const predIndex = task.predecessor.indexOf(previousValue);
                                if (predIndex !== -1) {
                                    task.predecessor.splice(predIndex, 1, taskArr); // Remove the matching predecessor
                                }
                            });
                            alert(`The predecessor of task code ${previousValue} has been replaced with the new predecessor ${taskArr}.`);
                        } else {
                            pertEntry[taskIndex].code = taskArr
                        }
                    }
                }

            } else if (input.classList.contains('description-input')) {
                pertEntry[taskIndex].description = event.target.value
            } else if (input.classList.contains('predecessor-input')) {
                pertEntry[taskIndex].predecessor.length = 0
                const splitPred = (event.target.value).split(',').map(code => code.trim());
                const invalidPred = splitPred.filter(pred => !pertEntry.slice(0, taskIndex).some(task => task.code === pred))
                if (invalidPred.length > 0) {
                    alert(`Invalid predecessor codes: ${splitPred.join(', ')}`);
                } else {
                    splitPred.forEach(pred => {
                        pertEntry[taskIndex].predecessor.push(pred);
                    });
                }
            }
            calculatePertValues(pertEntry)
            updateDisplayedValues()
            updateNodesAndLinks()
            displayGraph(nodes, links)
        })
    })
}

function updateNodesAndLinks () {
    if (pertEntry.length > 0) {
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
                    target: task.codeNo,
                    criticalPath: task.criticalPath
                })
            })
        })
        console.log(links)

        // Linking Start node to a none predecessor nodes
        pertEntry.forEach(task => {
            if (task.predecessor.length === 0) {
                links.push({
                    source: 'start',
                    target: task.codeNo
                })
            }
        })

        // Linking Finish node to a none successor nodes
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
}

// button selectors
const addActivityBtn = document.querySelector(".add-button")
const forceReloadData = document.querySelector(".update-button")
const removeAllDataBtn = document.querySelector('.remove-button')
addActivityBtn.addEventListener('click', () => {
    addActivity(pertEntry)
})
forceReloadData.addEventListener('click', forceDataReload)
removeAllDataBtn.addEventListener('click', () => {
    removeAllData(pertEntry)
})

calculatePertValues(pertEntry)
updateDisplayedValues()
updateNodesAndLinks()
