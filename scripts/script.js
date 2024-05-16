let pertHTML = '';

pertEntry.forEach((data) => {
    // Computation for Expected Time.
    let ET = Math.round((data.a + (4 * data.m) + data.b) / 6);


    pertHTML += `
        <tr>
            <td>${data.code}</td>
            <td>${data.predecessor}</td>
            <td>${data.a}</td>
            <td>${data.m}</td>
            <td>${data.b}</td>
            <td>${ET}</td>
        </tr>
    `
})

console.log(pertHTML)

document.querySelector('.PERT-body').innerHTML = pertHTML;