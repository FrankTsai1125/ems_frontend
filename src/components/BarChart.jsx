import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Bar } from 'react-chartjs-2'; // 將 Line 改為 Bar
import axios from 'axios'; // 引入 axios
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const getInvs = () => {
        axios
            .get("/api/invs/") // 使用 axios.get
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
                                backgroundColor: 'rgba(75, 192, 192, 1)', // 條形的顏色
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
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
                text: '每日交流輸出 (ac_daily)', // 圖表標題
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
                beginAtZero: true, // y 軸從零開始
            },
        },
    };

    return (
        <Card title="每日交流輸出 (ac_daily)" style={{ width: 600 }} bordered={true}>
            <div style={{ position: 'relative', height: '300px', width: '100%' }}> {/* 設定圖表的高度 */}
                <Bar data={chartData} options={options} /> {/* 使用 Bar 而不是 Line */}
            </div>
        </Card>
    );
};

export default BarChart;
