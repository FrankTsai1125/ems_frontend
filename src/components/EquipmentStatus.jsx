import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Spin, Alert, message, Card, Row, Col, Statistic } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import ErrorBoundary from './ErrorBoundary';

const EquipmentStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [statistics, setStatistics] = useState({
    '全部設備': 0,
    '正常並網': 0,
    '待機': 0,
    '故障停運': 0,
    '關機': 0,
    '未知狀態': 0
  });

  useEffect(() => {
    const init = async () => {
      try {
        await fetchData();
        setInitialized(true);
      } catch (error) {
        console.error('初始化失敗:', error);
        setError(error.message);
      }
    };

    init();
    const interval = setInterval(fetchData, 180000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      //TODO
      const response = await fetch('http://localhost:8000/api/devices');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setData(result.devices || []);
      
      const stats = calculateStatistics(result.devices || []);
      setStatistics(stats);
      
      setLastUpdateTime(new Date());

    } catch (err) {
      console.error('獲取資料錯誤:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (data) => {
    const total = data.length;
    const stats = {
      '全部設備': total,
      '正常並網': 0,
      '待機': 0,
      '故障停運': 0,
      '關機': 0,
      '未知狀態': 0
    };

    data.forEach(item => {
      if (item.狀態 === '待機') {
        stats['待機']++;
      } else if (item.狀態 === '正常並網') {
        stats['正常並網']++;
      } else if (item.狀態 === '故障停運') {
        stats['故障停運']++;
      } else if (item.狀態 === '關機') {
        stats['關機']++;
      } else if (!item.狀態) {
        stats['未知狀態']++;
      }
    });

    return stats;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      '待機': '#faad14',      // 橙色
      '正常並網': '#52c41a',  // 綠色
      '正常停運': '#faad14',  // 橙色
      '故障停運': '#ff4d4f',  // 紅色
      '並網': '#52c41a',      // 綠色
      '關機': '#8c8c8c',      // 灰色
    };
    return colorMap[status] || '#d9d9d9';  // 如果狀態不在上述列表中，返回淺灰色
  };

  if (!initialized && !error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" tip="初始化中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="錯誤"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={fetchData}>
              重試
            </Button>
          }
        />
      </div>
    );
  }

  const columns = [
    {
      title: '設備編號',
      dataIndex: '序號',
      key: '序號',
      width: 100,
    },
    {
      title: '設備狀態',
      dataIndex: '狀態',
      key: '狀態',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: '實時功率',
      dataIndex: '實時功率',
      key: '實時功率',
      width: 120,
      sorter: (a, b) => {
        const aValue = parseFloat(a.實時功率.replace('W', ''));
        const bValue = parseFloat(b.實時功率.replace('W', ''));
        return aValue - bValue;
      },
    },
    {
      title: '設備SN碼',
      dataIndex: '設備SN碼',
      key: '設備SN碼',
      width: 200,
    },
    {
      title: '設備名稱',
      dataIndex: '設備名稱',
      key: '設備名稱',
      width: 180,
    },
    {
      title: '設備品牌',
      dataIndex: '設備品牌',
      key: '設備品牌',
      width: 120,
    },
    {
      title: '設備型號',
      dataIndex: '設備型號',
      key: '設備型號',
      width: 180,
    },
    {
      title: '歸屬場站',
      dataIndex: '歸屬場站',
      key: '歸屬場站',
      width: 120,
    },
    {
      title: '當日發電量',
      dataIndex: '當日發電量',
      key: '當日發電量',
      width: 130,
      sorter: (a, b) => {
        const aValue = parseFloat(a.當日發電量.replace('kWh', ''));
        const bValue = parseFloat(b.當日發電量.replace('kWh', ''));
        return aValue - bValue;
      },
    },
    {
      title: '總發電量',
      dataIndex: '總發電量',
      key: '總發電量',
      width: 130,
      sorter: (a, b) => {
        const aValue = parseFloat(a.總發電量.replace('kWh', ''));
        const bValue = parseFloat(b.總發電量.replace('kWh', ''));
        return aValue - bValue;
      },
    },
    {
      title: '今日最大功率',
      dataIndex: '今日最大功率',
      key: '今日最大功率',
      width: 130,
      sorter: (a, b) => {
        const aValue = parseFloat(a.今日最大功率.replace('W', ''));
        const bValue = parseFloat(b.今日最大功率.replace('W', ''));
        return aValue - bValue;
      },
    },
    {
      title: '額定功率',
      dataIndex: '額定功率',
      key: '額定功率',
      width: 120,
    },
    {
      title: '最大輸出功率',
      dataIndex: '最大輸出功率',
      key: '最大輸出功率',
      width: 130,
    },
    {
      title: '電網AB線電壓',
      dataIndex: '電網AB線電壓',
      key: '電網AB線電壓',
      width: 130,
    },
    {
      title: '電網BC線電壓',
      dataIndex: '電網BC線電壓',
      key: '電網BC線電壓',
      width: 130,
    },
    {
      title: '電網CA線電壓',
      dataIndex: '電網CA線電壓',
      key: '電網CA線電壓',
      width: 130,
    },
    {
      title: 'A相電流',
      dataIndex: 'A相電流',
      key: 'A相電流',
      width: 120,
    },
    {
      title: 'B相電流',
      dataIndex: 'B相電流',
      key: 'B相電流',
      width: 120,
    },
    {
      title: 'C相電流',
      dataIndex: 'C相電流',
      key: 'C相電流',
      width: 120,
    },
    {
      title: '電網頻率',
      dataIndex: '電網頻率',
      key: '電網頻率',
      width: 120,
    },
    {
      title: 'PV1電壓',
      dataIndex: 'PV1電壓',
      key: 'PV1電壓',
      width: 120,
    },
    {
      title: 'PV1電流',
      dataIndex: 'PV1電流',
      key: 'PV1電流',
      width: 120,
    },
    {
      title: 'PV2電壓',
      dataIndex: 'PV2電壓',
      key: 'PV2電壓',
      width: 120,
    },
    {
      title: 'PV2電流',
      dataIndex: 'PV2電流',
      key: 'PV2電流',
      width: 120,
    },
    {
      title: 'PV3電壓',
      dataIndex: 'PV3電壓',
      key: 'PV3電壓',
      width: 120,
    },
    {
      title: 'PV3電流',
      dataIndex: 'PV3電流',
      key: 'PV3電流',
      width: 120,
    },
    {
      title: 'PV4電壓',
      dataIndex: 'PV4電壓',
      key: 'PV4電壓',
      width: 120,
    },
    {
      title: 'PV4電流',
      dataIndex: 'PV4電流',
      key: 'PV4電流',
      width: 120,
    },
    {
      title: '效率',
      dataIndex: '效率',
      key: '效率',
      width: 100,
    },
    {
      title: '內部溫度',
      dataIndex: '內部溫度',
      key: '內部溫度',
      width: 120,
    },
    {
      title: '絕緣阻抗',
      dataIndex: '絕緣阻抗',
      key: '絕緣阻抗',
      width: 120,
    },
    {
      title: '功率因數',
      dataIndex: '功率因數',
      key: '功率因數',
      width: 120,
    },
    {
      title: '更新時間',
      dataIndex: '更新時間',
      key: '更新時間',
      width: 180,
    },
    {
      title: '串列數量',
      dataIndex: '串列數量',
      key: '串列數量',
      width: 120,
    },
    {
      title: 'MPPT數量',
      dataIndex: 'MPPT數量',
      key: 'MPPT數量',
      width: 120,
    }
  ];

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px', color: '#666' }}>
          <p>資料筆數: {data?.length || 0}</p>
          <p>最後更新: {lastUpdateTime?.toLocaleString()}</p>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card>
              <Row gutter={16}>
                <Col span={3}>
                  <Statistic 
                    title="全部設備" 
                    value={statistics['全部設備']}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={3}>
                  <Statistic 
                    title="正常並網" 
                    value={statistics['正常並網']}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={3}>
                  <Statistic 
                    title="待機" 
                    value={statistics['待機']}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={3}>
                  <Statistic 
                    title="故障停運" 
                    value={statistics['故障停運']}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
                <Col span={3}>
                  <Statistic 
                    title="關機" 
                    value={statistics['關機']}
                    valueStyle={{ color: '#8c8c8c' }}
                  />
                </Col>
                <Col span={3}>
                  <Statistic 
                    title="未知狀態" 
                    value={statistics['未知狀態']}
                    valueStyle={{ color: '#d9d9d9' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            最後更新時間：
            {lastUpdateTime ? lastUpdateTime.toLocaleString() : '尚未更新'}
            （每3分鐘自動更新）
          </span>
          <Button 
            type="primary" 
            onClick={fetchData} 
            loading={loading}
          >
            立即更新
          </Button>
        </div>

        <Table 
          columns={columns}
          dataSource={data}
          pagination={{ 
            defaultPageSize: 30,         // 設置預設每頁顯示 30 筆
            pageSize: 30,               // 當前每頁顯示數量
            showSizeChanger: true,      // 允許改變每頁顯示數量
            showQuickJumper: true,      // 允許快速跳轉
            pageSizeOptions: ['30', '50', '100', '500'],  // 可選擇的每頁數量選項
          }}
          scroll={{ x: 'max-content' }}
          bordered
          loading={loading}
          onError={(error) => {
            console.error('Table error:', error);
          }}
          locale={{
            emptyText: '暫無數據'
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default EquipmentStatus;
