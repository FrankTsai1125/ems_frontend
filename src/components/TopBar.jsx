import React from 'react';
import { Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const TopBar = ({ tabs, activeKey, onTabChange, onTabClose }) => {
  const { TabPane } = Tabs;

  // 自定義關閉按鈕
  const CustomCloseIcon = ({ id }) => (
    <CloseOutlined
      className="custom-close-icon"
      onClick={(e) => {
        e.stopPropagation();
        onTabClose(id);
      }}
    />
  );

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      type="card"
      style={{ 
        background: '#fff',
        padding: '8px 8px 0 8px',
        marginBottom: '1px'
      }}
    >
      {tabs.map((tab) => (
        <TabPane
          key={tab.key}
          tab={
            <span>
              {tab.icon} {/* 這裡可以根據不同的頁面顯示不同的圖標 */}
              {tab.title}
              <CustomCloseIcon id={tab.key} />
            </span>
          }
        />
      ))}
    </Tabs>
  );
};

export default TopBar; 