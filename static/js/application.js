$(document).ready(() => {
    // Connect to socket server
    const socket = io.connect(`http://${document.domain}:${location.port}/test`);
    const messagesReceived = [];
    let threatCount = 0;

    // Initialize Chart with better styling
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Tarmoq oqimlari',
                data: [],
                backgroundColor: 'gray',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {display: false},
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#6B7280',
                    },
                    gridLines: {
                        color: '#E5E7EB',
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#6B7280',
                    },
                    gridLines: {
                        color: '#E5E7EB',
                    },
                }],
            },
        },
    });

    // Helper function to determine threat class
    function getThreatClass(threat) {
        if (!threat || threat === 'None' || threat === 'null') return '';
        const lowerThreat = threat.toLowerCase();
        if (lowerThreat.includes('high') || lowerThreat.includes('yuqori')) return 'threat-high';
        if (lowerThreat.includes('medium') || lowerThreat.includes('o\'rta')) return 'threat-medium';
        return 'threat-low';
    }

    // Helper function to generate random colors for chart
    function generateChartColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137.508) % 360; // Golden angle approximation
            colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
        }
        return colors;
    }

    // Helper function to update statistics
    function updateStatistics() {
        $('#totalFlows').text(messagesReceived.length);

        const currentThreats = messagesReceived.filter(row =>
            row[12] && row[12] !== 'None' && row[12] !== 'null' && row[12].trim() !== '',
        ).length;
        $('#threatCount').text(currentThreats);
    }

    // Helper function to build table rows
    function buildTableRows() {
        let tableRows = '';

        for (let i = messagesReceived.length - 1; i >= 0; i--) {
            const row = messagesReceived[i];
            const threatClass = getThreatClass(row[12]);

            tableRows += `
                <tr class="table-row border-b border-gray-100 ${threatClass}">
                    <td class="py-4 px-3 text-sm font-mono">${row[0] || '-'}</td>
                    <td class="py-4 px-3 text-sm font-mono">${row[1] || '-'}</td>
                    <td class="py-4 px-3 text-sm">${row[2] || '-'}</td>
                    <td class="py-4 px-3 text-sm font-mono">${row[3] || '-'}</td>
                    <td class="py-4 px-3 text-sm">${row[4] || '-'}</td>
                    <td class="py-4 px-3 text-sm">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${row[5] || '-'}
                        </span>
                    </td>
                    <td class="py-4 px-3 text-sm text-gray-600">${dayjs(row[6]).format('DD.MM.YYYY, HH:mm:ss')}</td>
                    <td class="py-4 px-3 text-sm text-gray-600">${dayjs(row[7]).format('DD.MM.YYYY, HH:mm:ss')}</td>
                    <td class="py-4 px-3 text-sm">${row[8] || '-'}</td>
                    <td class="py-4 px-3 text-sm">${row[9] || '-'}</td>
                    <td class="py-4 px-3 text-sm">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            ${row[10] || '-'}
                        </span>
                    </td>
                    <td class="py-4 px-3 text-sm">${row[11] || '-'}%</td>
                    <td class="py-4 px-3 text-sm">
                        ${row[12] && row[12] !== 'None' && row[12] !== 'null' ?
                `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThreatClass(row[12])}">${row[12]}</span>` :
                '<span class="text-gray-400">-</span>'
            }
                    </td>
                    <td class="py-4 px-3 text-sm">
                        <a href="/flow-detail?flow_id=${row[0]}" class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                            </svg>
                            Tafsilotlar
                        </a>
                    </td>
                </tr>
            `;
        }

        return tableRows;
    }

    // Helper function to update chart
    function updateChart(ipsData) {
        if (ipsData && ipsData.length > 0) {
            myChart.data.labels = ipsData.map(item => item.SourceIP);
            myChart.data.datasets[0].data = ipsData.map(item => item.count);

            // Generate colors based on data
            const colors = generateChartColors(ipsData.length);
            myChart.data.datasets[0].backgroundColor = colors;
            myChart.update();
        }
    }

    // Main socket event handler
    socket.on('newresult', (msg) => {
        console.log('Received new result:', msg.result);

        // Add new message to array
        messagesReceived.push(msg.result);

        // Update statistics
        updateStatistics();

        // Build and update table
        const tableRows = buildTableRows();
        $('#tableBody').html(tableRows);

        // Update chart
        updateChart(msg.ips);
    });

    // Socket connection handlers
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    // Add demo loading animation
    setTimeout(() => {
        if (messagesReceived.length === 0) {
            $('#tableBody').html(`
                <tr>
                    <td colspan="14" class="text-center py-12 text-gray-500">
                        <div class="flex flex-col items-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p class="text-lg font-medium">Tarmoq oqimlarini kuzatish...</p>
                            <p class="text-sm">Real vaqt ma'lumotlarini kutmoqda</p>
                        </div>
                    </td>
                </tr>
            `);
        }
    }, 3000);

    // Optional: Add periodic updates or status checks
    setInterval(() => {
        // You can add periodic status updates here if needed
        // For example, checking server connectivity
    }, 30000); // Every 30 seconds
});