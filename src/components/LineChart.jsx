import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const LineChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const getInvs = () => {
        axios //TODO
            .get("/api/invs/")
            .then((res) => {
                console.log('Response status:', res.status); // 記錄響應狀態
                if (res.status === 200) {
                    const data = res.data; // 提取數據
                    console.log(data); // 記錄獲取的數據

                    // 提取 inv_no 和 ac_daily 數據
                    const labels = data.map(item => item.inv_no); // 假設 inv_no 是你的標籤
                    const acDailyData = data.map(item => item.ac_daily); // 獲取 ac_daily 數據

                    // 更新 chartData 狀態
                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: '每日交流輸出 (ac_daily)',
                                data: acDailyData,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                            },
                        ],
                    });
                } else {
                    alert('Failed to fetch invs.'); // 如果狀態不是 200，顯示錯誤
                }
            })
            .catch((err) => alert(err));
    };

    useEffect(() => {
        getInvs(); // 在組件掛載時獲取數據
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
            },
        },
        scales: {
          x: {
              title: {
                  display: true,
                  text: 'inv_no', // x 軸標題
              },
          },
          y: {
              title: {
                  display: true,
                  text: 'kw', // y 軸標題
              },
          },
      },
    };

    return (
        <Card title="每日交流輸出 (ac_daily)" style={{ width: 600 }} bordered={true}>
            <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                <Line data={chartData} options={options} />
            </div>
        </Card>
    );
};

export default LineChart;