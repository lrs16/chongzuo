import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Table, Row, Button, Select, Input } from 'antd';

const { Option } = Select;

function TestingFacility(props) {
  const { title, isEdit, dataSource, ChangeValue, dispatch, statusY } = props;
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
    newdata[key - 1].deviceName = rowdata.deviceName;
    newdata[key - 1].deviceConfig = rowdata.deviceConfig;
    newdata[key - 1].deployApp = rowdata.deployApp;
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
    dispatch({
      type: 'testenvironment/querystatusY',
      payload: {
        useStatus: 'Y',
        pageIndex: 1,
        pageSize: 200,
      },
    });
  }, [])

  useEffect(() => {
    if (dataSource && dataSource.length && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        isNew: true,
        key: (index + 1).toString(),
      }));
      setData(newData)
    };
    if (dataSource && dataSource.length === 0) {
      newMember()
    }
  }, [dataSource])

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
        if (record.isNew && isEdit) {
          return (
            <>
              <Select placeholder="请选择" onChange={v => handleChange(v, record.key)} value={text}>
                {statusY && statusY.map(obj => [
                  <Option key={obj.id} value={JSON.stringify(obj)}>
                    {obj.deviceName}
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
      render: (text) => {
        return (<span dangerouslySetInnerHTML={{ __html: text?.replace(/[\n]/g, '<br/>') }} />)
      }
    },
    {
      title: '部署应用',
      dataIndex: 'deployApp',
      key: 'deployApp',
      render: (text) => {
        return (<span dangerouslySetInnerHTML={{ __html: text?.replace(/[\n]/g, '<br/>') }} />)
      }
    },
  ];


  return (
    <>
      <Row>
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

export default connect(({ testenvironment, loading }) => ({
  statusY: testenvironment.statusY,
  loading: loading.models.testenvironment,
}))(TestingFacility);