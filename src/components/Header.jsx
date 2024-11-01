import React from 'react';
import { Layout, Avatar } from 'antd';
import Title from 'antd/lib/typography/Title';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const CustomHeader = () => (
  <Header style={{ background: '#001529', padding: 0 }}>
    <Avatar style={{ float: 'right' }} size="large" icon={<UserOutlined />} />
    <Title style={{ color: 'white', margin: '0 16px' }} level={3}>Header</Title>
  </Header>
);

export default CustomHeader;