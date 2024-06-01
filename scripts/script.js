function checkPredecessor(task) {
    return task.predecessor.length === 0 ? "None" : task.predecessor
}
const findTaskByCode = code => pertEntry.find(task => task.code === code)
// Calculation of Forward Pass

let pertHTML = '';
pertEntry.forEach(task => {

    // Computation for Expected Time.
    task.ET = Math.round((task.a + (4 * task.m) + task.b) / 6);

    if (task.predecessor.length === 0) {
        task.ES = 0;
    } else {
        task.ES = Math.max(...task.predecessor.map(code => {
            const predTask = findTaskByCode(code);
            return predTask ? predTask.EF : 0;
        }))
    }
    task.EF = task.ES + task.ET;

    console.log(task.EF)

    pertHTML += `
    <tr>
        <td>${task.codeNo}</td>
        <td>${checkPredecessor(task)}</td>
        <td>${task.a}</td>
        <td>${task.m}</td>
        <td>${task.b}</td>
        <td>${task.ET}</td>
        <td class="earliest-start">${task.ES}</td>
        <td class="earliest-finish">${task.EF}</td>
        <td class="latest-start"></td>
        <td class="latest-finish"></td>
        <td class="slack"></td>
    </tr>
    `
})
document.querySelector('.PERT-body').innerHTML = pertHTML;



