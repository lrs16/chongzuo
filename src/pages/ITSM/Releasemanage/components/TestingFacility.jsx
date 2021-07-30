import React, { useState, useEffect } from 'react';
import { Table, Row, Button, Select, Input } from 'antd';

const { Option } = Select;

const typedata = [
  { key: '1', name: '测试环境', type: 'dell', app: '计量运维辅助平台' },
  { key: '2', name: '开发环境', type: 'hp', app: '计量运维辅助平台' },
  { key: '3', name: 'Ⅲ区数据库服务器', type: '型号：曙光I620-G20 配置：CPU:2路12核 Xeon处理器；内存：256G DDR4内存；硬盘：4×240GB SSD硬盘8×1200GB HDD硬盘 操作系统：Red Hat 7.3', app: '3oracle数据库' },
];

function TestingFacility(props) {
  const { title, isEdit, dataSource, ChangeValue } = props;
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowrecord, setSelectedRowRecord] = useState([]);

  // 新增一条记录
  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      deviceName: '',
      deviceConfig: '',
      deployApp: '',
      isNew: true,
    });
    setData(newData);
    setSelectedRowKeys([]);
    setSelectedRowRecord([]);
  };

  const handleChange = (value, key) => {
    const rowdata = JSON.parse(value);
    const newdata = [...data];
    newdata[key - 1].deviceName = rowdata.name;
    newdata[key - 1].deviceConfig = rowdata.type;
    newdata[key - 1].deployApp = rowdata.app;
    setData(newdata);
    ChangeValue(newdata);
  }

  const handelDelete = () => {
    const newarr = [];
    const arr = [];
    data.forEach(item => {
      if (!selectedRowrecord.includes(item)) {
        newarr.push(item)
      }
    });
    setData([...newarr]);
    data.forEach(item => {
      if (!selectedRowrecord.includes(item) && item.name !== '') {
        arr.push(item)
      }
    });
    ChangeValue(arr);
    setSelectedRowKeys([]);
    setSelectedRowRecord([]);
  }

  const onSelectChange = (rowkeys, recordkeys) => {
    setSelectedRowKeys(rowkeys);
    setSelectedRowRecord(recordkeys)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    if (dataSource.length && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        isNew: true,
        key: (index + 1).toString(),
      }));
      setData(newData)
    }
  }, [dataSource])

  useEffect(() => {
    if (data.length === 0) {
      newMember()
    }
  }, [data])

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '设备名称及用途',
      dataIndex: 'deviceName',
      key: 'deviceName',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <>
              <Select placeholder="请选择" onChange={v => handleChange(v, record.key)} value={text}>
                {typedata.map(obj => [
                  <Option key={obj.key} value={JSON.stringify(obj)}>
                    {obj.name}
                  </Option>,
                ])}
              </Select>
            </>
          )
        }
        return text;
      }
    },
    {
      title: '设备型号配置',
      dataIndex: 'deviceConfig',
      key: 'deviceConfig',
    },
    {
      title: '部署应用',
      dataIndex: 'deployApp',
      key: 'deployApp',
    },
  ];


  return (
    <>
      <Row style={{ marginBottom: 8 }}>
        <h4 style={{ float: 'left' }}><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{title}</h4>
        {isEdit && (<div style={{ float: 'right' }}>
          <Button
            type='primary'
            style={{ marginRight: 8 }}
            onClick={() => newMember()}
          >新增</Button>
          <Button type='danger' style={{ marginRight: 8 }} ghost onClick={() => handelDelete()}>移除</Button>
          <Button type='primary' >导出清单</Button>
        </div>
        )}
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size='middle'
        rowKey={(_, index) => index.toString()}
        pagination={false}
        rowSelection={rowSelection}
      />
    </>
  );
}

export default TestingFacility;