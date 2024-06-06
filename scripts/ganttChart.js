// Function to get the current date in 'YYYY-MM-DD' format
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to format a date with the given day offset
function formatDate(dayOffset) {
    const now = new Date();
    now.setDate(now.getDate() + dayOffset); // Offset the day based on the parameter
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to update and re-render the Gantt chart
function updateGanttChart() {
    const currentDate = getCurrentDate();

    const data = {
        labels: [],
        datasets: [{
            label: 'PERT/CPM Gantt Chart',
            data: [],
            backgroundColor: '#37b6d4',
            borderColor: 'transparent',
            barPercentage: 0.5
        }]
    };

    // Push PERT data and activity
    pertEntry.forEach(task => {
        // Push task code to labels
        data.labels.push(task.code);

        // Format the dates and push to data array
        const esFormatted = formatDate(task.ES);
        const lfFormatted = formatDate(task.LF);
        data.datasets[0].data.push([esFormatted, lfFormatted]);
    });

    // Config for the chart
    const config = {
        type: 'bar',
        data,
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#111827"
                    },
                    ticks: {
                        font: {
                            size: 15,
                            family: 'Helvetica, sans-serif',
                            color: '#FFFFFF'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Tasks',
                        color: '#DDDDDDCC',
                        font: {
                            size: 16,
                            family: 'Helvetica, sans-serif'
                        }
                    }
                },
                x: {
                    min: currentDate,
                    type: "time",
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        color: "#111827"
                    },
                    ticks: {
                        font: {
                            size: 14,
                            family: 'Helvetica, sans-serif',
                            color: '#FFFFFF' // X-axis labels color
                        }
                    },
                    title: {
                        display: true,
                        text: 'Dates',
                        color: '#DDDDDDCC', // X-axis title color
                        font: {
                            size: 16,
                            family: 'Helvetica, sans-serif'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 16,
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let label = myChart.data.labels[tooltipItem.dataIndex];
                            let value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex]

                            return label + ": " + value;
                        }
                    },
                    bodyFont: {
                        size: 18
                    }
                }
            }
        }
    };

    // Render the chart
    if (window.myChart && typeof window.myChart.destroy === 'function') {
        window.myChart.destroy(); // Destroy the previous instance to avoid duplicate charts
    }
    window.myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

}
updateGanttChart()
