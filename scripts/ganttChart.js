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

function criticalPathColor () {
    return pertEntry.map(task => task.slack > 0 ? "#D43737" : "#37b5d4")
}

// Function to update and re-render the Gantt chart
function updateGanttChart() {
    const currentDate = getCurrentDate();

    const data = {
        labels: [],
        barPercentage: .5,
        datasets: [
            {
                label: 'Critical Path',
                data: pertEntry.filter(task => task.slack === 0).map(task => ({
                    x: [formatDate(task.ES), formatDate(task.LF)],
                    y: task.code
                })),
                backgroundColor: "#37b5d4",
                borderColor: 'transparent',

            },
            {
                label: 'Non-Critical Path',
                data: pertEntry.filter(task => task.slack > 0).map(task => ({
                    x: [formatDate(task.ES), formatDate(task.LF + task.slack)],
                    y: task.code
                })),
                backgroundColor: "#D43737",
                borderColor: 'transparent',
            }
        ]
    };

    // Push PERT data and activity
    pertEntry.forEach(task => {
        data.labels.push(task.code);
        const esFormatted = formatDate(task.ES);
        const lfFormatted = formatDate(task.LF);
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
                        label: function (tooltipItem) {
                            const task = pertEntry.find(t => t.code === tooltipItem.label);
                            const esDate = formatDate(task.ES);
                            const lfDate = formatDate(task.LF + task.slack);
                            const slack = task.slack
                            const duration = (task.ES + task.LF);
                            return [
                                `Date: ${esDate} to ${lfDate}`,
                                `Delay day(s): ${slack}`,
                                `Duration: ${duration} + ${slack} day(s)`
                            ];
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
