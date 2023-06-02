import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const App = () => {
  const [data, setData] = useState([]);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://wsptoolchecker.azurewebsites.net/api/data');
      const jsonData = await response.json();
      setData(jsonData);
      generateCharts(jsonData);
    } catch (error) {
      console.log(error);
      // Handle error if data fetch fails
    }
  };

  const generateCharts = (data) => {
    const labels = data.map(row => row.ProcessName);
    const maxIdleTimes = data.map(row => row.MaxIdleTime);

    if (barChartRef.current && pieChartRef.current) {
      new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Max Idle Time',
            data: maxIdleTimes,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                beginAtZero: true
              }
            },
            y: {
              grid: {
                drawBorder: false
              },
              ticks: {
                beginAtZero: true
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Max Idle Time Bar Chart',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          }
        }
      });

      new Chart(pieChartRef.current, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Max Idle Time',
            data: maxIdleTimes,
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            },
            title: {
              display: true,
              text: 'Max Idle Time Distribution',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          }
        }
      });
    }
  };

  return (
    <div className="container">
      <h1>WSP Tools Health Dashboard</h1>
      <table id="data-table">
        <thead>
          <tr>
            <th>Application Name</th>
            <th>Application ID</th>
            <th>Max Idle Time</th>
            <th>Machine Name</th>
            <th>Application Title</th>
            <th>User ID</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, index) => (
            <tr key={index}>
              <td>{rowData.ProcessName}</td>
              <td>{rowData.ProcessId}</td>
              <td>{rowData.MaxIdleTime}</td>
              <td>{rowData.MachineName}</td>
              <td>{rowData.ProcessTitle}</td>
              <td>{rowData.UserName}</td>
              <td>{rowData.CreatedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="chart-container">
        <div className="chart">
          <canvas id="bar-chart" ref={barChartRef}></canvas>
          <h2>Max Idle Time Bar Chart</h2>
        </div>
        <div className="chart">
          <canvas id="pie-chart" ref={pieChartRef}></canvas>
          <h2>Max Idle Time Distribution</h2>
        </div>
      </div>
    </div>
  );
};

export default App;
