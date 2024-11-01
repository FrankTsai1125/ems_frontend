import React from 'react';
import LineChart from '../components/LineChart'; // 根據您的路徑調整
import BarChart from '../components/BarChart'; // 根據您的路徑調整

const Dashboard = () => {
  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <LineChart />
      <BarChart />
    </div>
  );
};

// 確保這裡有正確的 default 導出
export default Dashboard;