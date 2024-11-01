import React from 'react';
import Settings from '../components/Settings'; // 根據您的路徑調整


const SettingsPage = () => {
  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <p> <Settings/></p>
    </div>
  );
};

// 確保這裡有正確的 default 導出
export default SettingsPage;