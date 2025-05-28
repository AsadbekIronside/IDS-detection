$(document).ready(() => {
    // Connect to socket server
    const socket = io.connect(`http://${document.domain}:${location.port}/test`);

    const messagesReceived = [];

    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [], // you can add colors here if needed
                borderColor: [],
                borderWidth: 1,
            }],
        },
        options: {
            plugins: {
                legend: {display: false},
            },
            scales: {
                yAxes: [{
                    ticks: {beginAtZero: true},
                }],
            },
        },
    });

    socket.on('newresult', (msg) => {
        console.log('Received result', msg.result);

        // Maintain last 10 messages
        if (messagesReceived.length >= 10) messagesReceived.shift();
        messagesReceived.push(msg.result);

        // Build the table header
        let messagesString = `
      <tr>
        <th>Flow ID</th><th>Src IP</th><th>Src Port</th><th>Dst IP</th><th>Dst Port</th>
        <th>Protocol</th><th>Flow start time</th><th>Flow last seen</th>
        <th>App name</th><th>PID</th><th>Prediction</th><th>Prob</th><th>Risk</th>
      </tr>`;

        // Build table rows from messagesReceived in reverse order
        for (let i = messagesReceived.length - 1; i >= 0; i--) {
            const row = messagesReceived[i];
            messagesString += '<tr>';

            for (const cell of row) {
                messagesString += `<td>${cell}</td>`;
            }

            messagesString += `<td><a href="/flow-detail?flow_id=${row[0]}"><div>Detail</div></a></td></tr>`;
        }

        $('#details').html(messagesString);

        // Update Chart.js data and labels
        msg.ips.forEach(({count, SourceIP}, i) => {
            myChart.data.datasets[0].data[i] = count;
            myChart.data.labels[i] = SourceIP;
        });

        myChart.update();
    });
});
