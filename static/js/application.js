$(document).ready(() => {
    // Connect to socket server
    const socket = io.connect(`http://${document.domain}:${location.port}/test`);

    const messagesReceived = [];

    const myChart = new Chart(document.getElementById('myChart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Tarmoq oqimlari',
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
        // console.log('Received result', msg.result);

        messagesReceived.push(msg.result);

        // Build the table header
        let messagesString = `
          <tr>
            <th>Oqim ID si</th>
            <th>Manba IP si</th>
            <th>Manba porti</th>
            <th>Manzil IP si</th>
            <th>Manzil porti</th>
            <th>Protokol</th>
            <th>Oqim boshlanish vaqti</th>
            <th>Oqim oxirgi kuzatilgan vaqti</th>
            <th>Ilova nomi</th>
            <th>PID</th>
            <th>Bashorat qilish</th>
            <th>Ehtimollik</th>
            <th>Tahdid</th>
          </tr>`;

        // Build table rows from messagesReceived in reverse order
        for (let i = messagesReceived.length - 1; i >= 0; i--) {
            const row = messagesReceived[i];
            messagesString += '<tr>';

            for (const cell of row) {
                messagesString += `<td>${cell}</td>`;
            }

            messagesString += `<td><a href="/flow-detail?flow_id=${row[0]}"><div>Tafsilotlar</div></a></td></tr>`;
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
