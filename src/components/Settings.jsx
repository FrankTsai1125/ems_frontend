import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spin, Alert, Input, Button } from 'antd';

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editable, setEditable] = useState(false); // 用於控制編輯狀態
  const [formData, setFormData] = useState({}); // 儲存可編輯的表單數據

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`, // 假設使用 Bearer Token
          },
        });
        setUserData(response.data);
        setFormData(response.data); // 初始化表單數據
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('無法獲取用戶資料');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // 更新表單數據
  };

  const handleEdit = () => {
    setEditable(!editable); // 切換編輯狀態
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:8000/auth/update', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setUserData(response.data); // 更新用戶數據
      setEditable(false); // 保存後關閉編輯模式
    } catch (error) {
      console.error('Failed to update user data:', error);
      setError('更新用戶資料失敗');
    }
  };

  if (loading) {
    return <Spin tip="加載中..." />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <Card title="用戶設置" style={{ margin: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>用戶名:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>
            {editable ? (
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            ) : (
              userData.username
            )}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>姓氏:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>
            {editable ? (
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            ) : (
              userData.first_name
            )}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>名字:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>
            {editable ? (
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            ) : (
              userData.last_name
            )}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>電子郵件:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>
            {editable ? (
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              userData.email
            )}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>是否超級用戶:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>{userData.is_superuser ? '是' : '否'}</Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>是否工作人員:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>{userData.is_staff ? '是' : '否'}</Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>是否活躍:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>{userData.is_active ? '是' : '否'}</Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>最後登錄:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>{userData.last_login ? new Date(userData.last_login).toLocaleString() : '無'}</Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: '10px', width: '100%' }}>
          <Col span={6} style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>加入日期:</Col>
          <Col span={18} style={{ fontSize: '24px', textAlign: 'center' }}>{new Date(userData.date_joined).toLocaleString()}</Col>
        </Row>
        <Button type="primary" onClick={handleEdit} style={{ marginTop: '20px', marginRight: '10px' }}>
          {editable ? '取消編輯' : '編輯'}
        </Button>
        {editable && (
          <Button type="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
            保存
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Settings;
