import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from '../components/Header';
import SidebarComponent from '../components/Sidebar';
import MainContent from '../components/Content';
import FooterComponent from '../components/Footer';
import TopBar from '../components/TopBar';
import {
  DashboardOutlined,
  ToolOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  MonitorOutlined,
  AppstoreOutlined,
  BulbOutlined
} from '@ant-design/icons';

const Home = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [tabs, setTabs] = useState([]);
  
  // 定義頁面標題和圖標的映射
  const pageConfig = {
    dashboard: { title: '儀錶板', icon: <DashboardOutlined /> },
    'equipment-status': { title: '設備概況', icon: <MonitorOutlined /> },
    'site-status': { title: '案場概況', icon: <AppstoreOutlined /> },
    'analysis-discrete': { title: '離散率分析', icon: <BulbOutlined /> },
    equipment: { title: '我的設備', icon: <ToolOutlined /> },
    settings: { title: '設置', icon: <SettingOutlined /> },
    north: { title: '北部地區', icon: <EnvironmentOutlined /> },
    central: { title: '中部地區', icon: <EnvironmentOutlined /> },
    south: { title: '南部地區', icon: <EnvironmentOutlined /> },
  };

  // 當選擇新的側邊欄項目時
  const handleMenuSelect = (key) => {
    setSelectedKey(key);
    
    // 檢查標籤是否已存在
    if (!tabs.find(tab => tab.key === key) && pageConfig[key]) {
      setTabs([...tabs, {
        key: key,
        title: pageConfig[key].title,
        icon: pageConfig[key].icon
      }]);
    }
  };

  // 處理標籤切換
  const handleTabChange = (activeKey) => {
    setSelectedKey(activeKey);
  };

  // 處理標籤關閉
  const handleTabClose = (targetKey) => {
    const newTabs = tabs.filter(tab => tab.key !== targetKey);
    setTabs(newTabs);
    
    // 如果關閉的是當前選中的標籤，則選中最後一個標籤
    if (targetKey === selectedKey && newTabs.length > 0) {
      setSelectedKey(newTabs[newTabs.length - 1].key);
    } else if (newTabs.length === 0) {
      setSelectedKey('dashboard');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent />
      <Layout>
        <SidebarComponent onSelect={handleMenuSelect} />
        <Layout style={{ padding: '0' }}>
          <TopBar
            tabs={tabs}
            activeKey={selectedKey}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
          />
          <MainContent selectedKey={selectedKey} />
          <FooterComponent />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;