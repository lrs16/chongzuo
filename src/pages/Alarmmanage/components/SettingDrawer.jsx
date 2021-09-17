import React, { useState, useEffect } from 'react';
import { Table, Drawer, Input, Radio, Button, InputNumber } from 'antd';

const datas = [
  {
    key: '1',
    key1: 'CPU使用率',
    key2: '90',
    key3: '%',
    key4: '使用状态',
  }
]

function HostSettingDrawer(props) {
  const { title, visible, handleSubmit, ChangeVisible } = props;
  const [data, setData] = useState([]);
  const hanldleCancel = () => {
    ChangeVisible(false);
  };
  const handleOk = () => {
    handleSubmit(data);
    props.form.resetFields();
    ChangeVisible(false);
  };

  useEffect(() => {
    if (datas && datas.length > 0) {
      const newData = datas.map(item => ({ ...item }));
      setData(newData);
    }
  }, [datas])

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
    }
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
    },
    {
      title: '配置子项',
      dataIndex: 'key1',
      key: 'key1',
      render: (text, record) => {
        return (
          <Input
            key={record.key}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'key1', record.key)}
          />
        )
      },
    },
    {
      title: '阈值',
      dataIndex: 'key2',
      key: 'key2',
      render: (text, record) => {
        return (
          <InputNumber
            key={record.key}
            defaultValue={text}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            onChange={e => handleFieldChange(e, 'key2', record.key)}
          />
        )
      },
    },
    {
      title: '单位',
      dataIndex: 'key3',
      key: 'key3',
      render: (text, record) => {
        return (
          <Input
            key={record.key}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'key3', record.key)}
          />
        )
      },
    },
    {
      title: '使用状态',
      dataIndex: 'key4',
      key: 'key4',
      width: 200,
      render: (text, record) => {
        return (
          <Radio.Group
            onChange={e => handleFieldChange(e.target.value, 'key1', record.key)}
            value={text}>
            <Radio value='启用'>启用</Radio>
            <Radio value='停用'>停用</Radio>
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
      <Table columns={columns} dataSource={data} />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

export default HostSettingDrawer;