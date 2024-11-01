import React from 'react';
import { Layout, Card } from 'antd';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';

const { Content } = Layout;

const MainContent = ({ selectedKey }) => {
  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />; // 顯示 Dashboard 組件
      case 'north':
        return <div>顯示北部地區內容</div>;
      case 'central':
        return <div>顯示中部地區內容</div>;
      case 'south':
        return <div>顯示南部地區內容</div>;
      case 'settings' :
        return <Settings />;
      default:
        return <div>Welcome</div>;
    }
  };

  return (
    <Content style={{ padding: '24px', margin: 0, minHeight: '100%', background: '#fff' }}>
      {renderContent()}
    </Content>
  );
};

export default MainContent;