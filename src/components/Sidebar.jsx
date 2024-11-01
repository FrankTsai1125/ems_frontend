import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  ToolOutlined, 
  SettingOutlined, 
  EnvironmentOutlined, 
  LogoutOutlined,
  MonitorOutlined,
  AppstoreOutlined,
  AimOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SidebarComponent = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    onSelect('dashboard');
  };

  const handleSettingClick = () => {
    onSelect('settings');
  };

  const handleRegionSelect = (region) => {
    onSelect(region);
  };
  const handleLogout = async () => {
    try {
      // 發送登出請求
      await axios.post('http://localhost:8000/auth/logout', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // 假設使用 Bearer Token
        },
      });
      // 清除本地存儲中的 token
      localStorage.clear();
      // 重定向到登錄頁面
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // 這裡可以顯示錯誤提示給用戶
    }
  };

  return (
    <Sider width={200} style={{ background: '#fff', height: '100%' }} breakpoint="lg" collapsedWidth="0">
      <Menu mode="inline" defaultSelectedKeys={['dashboard']} style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key="dashboard" onClick={handleDashboardClick} icon={<DashboardOutlined />}>
          儀錶板
        </Menu.Item>
        
        <SubMenu key="monitor" icon={<MonitorOutlined />} title="監控管理">
          <Menu.Item key="equipment-status" onClick={() => onSelect('equipment-status')} icon={<AppstoreOutlined />}>
            設備概況
          </Menu.Item>
          <Menu.Item key="site-status" onClick={() => onSelect('site-status')} icon={<AimOutlined />}>
            案場概況
          </Menu.Item>
        </SubMenu>
        <SubMenu key="analysis" icon={<BulbOutlined />} title="智能分析">
          <Menu.Item key="analysis-discrete" onClick={() => {onSelect('analysis-discrete')}}icon={<AppstoreOutlined />}>
            離散率分析
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="equipment" icon={<ToolOutlined />}>
          我的設備
        </Menu.Item>
        <SubMenu key="sub1" icon={<EnvironmentOutlined />} title="我的案場">
          <Menu.Item key="north" onClick={() => handleRegionSelect('north')}>北部</Menu.Item>
          <Menu.Item key="central" onClick={() => handleRegionSelect('central')}>中部</Menu.Item>
          <Menu.Item key="south" onClick={() => handleRegionSelect('south')}>南部</Menu.Item>
        </SubMenu>
        <Menu.Item key="settings" onClick={handleSettingClick} icon={<SettingOutlined />}>
          設置
        </Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
          登出
        </Menu.Item>
      
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;