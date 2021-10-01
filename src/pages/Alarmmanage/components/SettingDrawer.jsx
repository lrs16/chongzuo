import React, { useState, useEffect } from 'react';
import { Table, Drawer, Radio, InputNumber, message } from 'antd';
import { updateConfigure } from '../services/api';

function HostSettingDrawer(props) {
  const { title, visible, ChangeVisible, configList } = props;
  const [data, setData] = useState([]);
  const hanldleCancel = () => {
    ChangeVisible(false);
  };

  useEffect(() => {
    if (configList && configList.length > 0) {
      const newData = configList.map(item => ({ ...item }));
      setData(newData);
    }
  }, [configList])

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  };
  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
      updateConfigure(target).then(res => {
        if (res.code === 200) {
          message.success('操作成功')
        } else {
          message.error('操作失败')
        }
      })
    }
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '配置子项',
      dataIndex: 'configureChildren',
      key: 'configureChildren',
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
      key: 'threshold',
      render: (text, record) => {
        return (
          <InputNumber
            key={record.key}
            defaultValue={text}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={e => handleFieldChange(e, 'threshold', record.key)}
          />
        )
      },
    },
    {
      title: '单位',
      dataIndex: 'punctuation',
      key: 'punctuation',
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (text, record) => {
        return (
          <Radio.Group
            onChange={e => handleFieldChange(e.target.value, 'status', record.key)}
            value={text}>
            <Radio value='1'>启用</Radio>
            <Radio value='0'>停用</Radio>
          </Radio.Group>
        )
      },
    },
  ]
  return (
    <Drawer
      title={title}
      width={800}
      onClose={hanldleCancel}
      visible={visible}
      bodyStyle={{ paddingBottom: 60 }}
      destroyOnClose
    >
      <Table columns={columns} dataSource={data} rowKey={record => record.id} pagination={false} />
    </Drawer>
  );
}

export default HostSettingDrawer;