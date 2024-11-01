import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Spin, Alert, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';  // 引入樣式

// 新增 ResizableTitle 組件
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            right: -5,
            bottom: 0,
            top: 0,
            width: 10,
            cursor: 'col-resize',
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

// 計算離散率的輔助函數
const calculateDispersionRate = (pvCurrents) => {
  // 過濾掉無效值
  const validCurrents = pvCurrents.filter(current => current !== null && current !== undefined);
  
  if (validCurrents.length === 0) return 0;
  
  // 計算平均值
  const mean = validCurrents.reduce((sum, curr) => sum + curr, 0) / validCurrents.length;
  
  // 計算標準差
  const squaredDiffs = validCurrents.map(curr => Math.pow(curr - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / validCurrents.length;
  const stdDev = Math.sqrt(variance);
  
  // 計算變異係數（離散率）
  return mean !== 0 ? stdDev / mean : 0;
};

const DiscreteAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [columns, setColumns] = useState([
    {
      title: '狀態',
      dataIndex: '狀態',
      key: '狀態',
      width: 100,
      render: (status) => (
        <Tag color={status === '運轉中' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
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
      title: '當日發電量(kWh)',
      dataIndex: '當日發電量',
      key: '當日發電量',
      width: 130,
      sorter: (a, b) => parseFloat(a.當日發電量) - parseFloat(b.當日發電量),
      render: (value) => value?.toFixed(2),
    },
    {
      title: '總發電量(kWh)',
      dataIndex: '總發電量',
      key: '總發電量',
      width: 130,
      sorter: (a, b) => parseFloat(a.總發電量) - parseFloat(b.總發電量),
      render: (value) => value?.toFixed(2),
    },
    {
      title: '今日最大功率(kW)',
      dataIndex: '今日最大功率',
      key: '今日最大功率',
      width: 130,
      sorter: (a, b) => parseFloat(a.今日最大功率) - parseFloat(b.今日最大功率),
      render: (value) => value?.toFixed(2),
    },
    {
      title: '額定功率(kW)',
      dataIndex: '額定功率',
      key: '額定功率',
      width: 130,
      sorter: (a, b) => parseFloat(a.額定功率) - parseFloat(b.額定功率),
      render: (value) => value?.toFixed(2),
    },
    {
      title: '離散率',
      dataIndex: '離散率',
      key: '離散率',
      width: 100,
      sorter: (a, b) => a.離散率 - b.離散率,
      render: (value) => (
        <Tag color={value > 0.05 ? 'red' : 'green'}>
          {(value * 100).toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: '平均電流(A)',
      dataIndex: '平均電流',
      key: '平均電流',
      width: 120,
      sorter: (a, b) => parseFloat(a.平均電流) - parseFloat(b.平均電流),
      render: (value) => value?.toFixed(2),
    },
    {
      title: 'PV1電流(A)',
      dataIndex: 'PV1電流',
      key: 'PV1電流',
      width: 100,
      sorter: (a, b) => parseFloat(a.PV1電流) - parseFloat(b.PV1電流),
      render: (value) => value?.toFixed(2),
    },
    {
      title: 'PV2電流(A)',
      dataIndex: 'PV2電流',
      key: 'PV2電流',
      width: 100,
      sorter: (a, b) => parseFloat(a.PV2電流) - parseFloat(b.PV2電流),
      render: (value) => value?.toFixed(2),
    },
    {
      title: 'PV3電流(A)',
      dataIndex: 'PV3電流',
      key: 'PV3電流',
      width: 100,
      sorter: (a, b) => parseFloat(a.PV3電流) - parseFloat(b.PV3電流),
      render: (value) => value?.toFixed(2),
    },
    {
      title: 'PV4電流(A)',
      dataIndex: 'PV4電流',
      key: 'PV4電流',
      width: 100,
      sorter: (a, b) => parseFloat(a.PV4電流) - parseFloat(b.PV4電流),
      render: (value) => value?.toFixed(2),
    },
  ]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 180000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('開始獲取數據...');

      const response = await fetch('http://localhost:8000/api/devices');
      console.log('API 響應狀態:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('獲取到的數據:', result);

      // Check if result.devices exists and is an array
      if (!result.devices || !Array.isArray(result.devices)) {
        throw new Error('伺服器返回的數據格式不正確');
      }

      // Process the data
      const processedData = result.devices.map((item, index) => {
        // 取得所有 PV 電流值
        const pvCurrents = [
          parseFloat(item.PV1電流),
          parseFloat(item.PV2電流),
          parseFloat(item.PV3電流),
          parseFloat(item.PV4電流)
        ].filter(current => !isNaN(current)); // 過濾掉無效值

        // 計算平均電流
        const avgCurrent = pvCurrents.length > 0 
          ? pvCurrents.reduce((sum, curr) => sum + curr, 0) / pvCurrents.length 
          : 0;

        return {
          key: index.toString(),
          狀態: item.狀態,
          設備SN碼: item.設備SN碼,
          設備名稱: item.設備名稱,
          當日發電量: parseFloat(item.當日發電量),
          總發電量: parseFloat(item.總發電量),
          今日最大功率: parseFloat(item.今日最大功率),
          額定功率: parseFloat(item.額定功率),
          離散率: calculateDispersionRate(pvCurrents),
          平均電流: avgCurrent,
          PV1電流: parseFloat(item.PV1電流),
          PV2電流: parseFloat(item.PV2電流),
          PV3電流: parseFloat(item.PV3電流),
          PV4電流: parseFloat(item.PV4電流),
        };
      });

      setData(processedData);
      setLastUpdateTime(new Date());

      message.success({
        content: '資料已成功更新',
        duration: 2, // 顯示 2 秒
        style: {
          marginTop: '20px', // 調整位置
        },
        icon: <CheckOutlined style={{ color: '#52c41a' }} /> // 添加綠色勾勾圖標
      });

    } catch (err) {
      console.error('獲取數據時出錯:', err);
      setError(err.message || '獲取數據失敗，請稍後再試');

      message.error({
        content: '資料更新失敗',
        duration: 2,
        style: {
          marginTop: '20px',
        }
      });

    } finally {
      setLoading(false);
    }
  };

  // 處理欄位寬度調整
  const handleResize = (index) => (e, { size }) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      width: size.width,
    };
    setColumns(newColumns);
  };

  // 處理表格標題
  const mergeColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  // 添加自定義樣式
  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" tip="載入中..." />
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
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
        components={components}
        columns={mergeColumns} 
        dataSource={data}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 'max-content' }}
        bordered
        loading={loading}
      />
    </div>
  );
};

// 添加自定義樣式
const styles = `
  .react-resizable {
    position: relative;
    background-clip: padding-box;
  }

  .react-resizable-handle {
    position: absolute;
    right: -5px;
    bottom: 0;
    top: 0;
    width: 10px;
    cursor: col-resize;
    z-index: 1;
  }

  .react-resizable-handle:hover {
    background-color: #f0f0f0;
  }

  .ant-table-thead > tr > th {
    position: relative;
  }
`;

// 將樣式添加到 document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default DiscreteAnalysis;
