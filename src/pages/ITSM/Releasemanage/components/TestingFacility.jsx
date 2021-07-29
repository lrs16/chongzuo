import React, { useState, useEffect } from 'react';
import { Table, Row, Button, Select, Input } from 'antd';
import styles from '../index.less';

const { Option } = Select;

const typedata = [
  { key: '1', name: '测试环境', type: 'dell', app: '计量运维辅助平台' },
  { key: '2', name: '开发环境', type: 'hp', app: '计量运维辅助平台' },
  { key: '3', name: '数据库备份', type: '华为', app: '自动化运维平台' },
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
      name: '',
      type: '',
      app: '',
      isNew: true,
    });
    setData(newData);
    setSelectedRowKeys([]);
    setSelectedRowRecord([]);
  };

  const handleChange = (value, key) => {
    const rowdata = JSON.parse(value);
    const newdata = [...data];
    newdata[key - 1].name = rowdata.name;
    newdata[key - 1].name = rowdata.name;
    newdata[key - 1].type = rowdata.type;
    newdata[key - 1].app = rowdata.app;
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
      setData(dataSource)
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
      dataIndex: 'name',
      key: 'name',
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
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '部署应用',
      dataIndex: 'app',
      key: 'app',
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