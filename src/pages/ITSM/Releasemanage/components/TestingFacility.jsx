import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Table, Row, Button, Select, Input, AutoComplete } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import UserContext from '@/layouts/MenuContext';

const { Option } = Select;
const { TextArea } = Input;

function TestingFacility(props) {
  const { title, isEdit, dataSource, ChangeValue, dispatch, statusY } = props;
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowrecord, setSelectedRowRecord] = useState([]);
  const [expand, setExpand] = useState(false);
  const { location, taskName } = useContext(UserContext);

  // 新增一条记录
  const newMember = () => {
    const newData = data.map((item, index) => ({
      ...item,
      editable: false,
      key: (index + 1).toString(),
    }));
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
    setExpand(true);
  };

  const handleChange = (value, key) => {
    const rowdata = statusY.filter(obj => obj.id === value)[0];
    const newdata = data.map(item => ({ ...item }));
    setData(newdata);
    if (newdata[key - 1]) {
      if (rowdata) {
        newdata[key - 1].deviceName = rowdata.deviceName;
        newdata[key - 1].deviceConfig = rowdata.deviceConfig;
        newdata[key - 1].deployApp = rowdata.deployApp;
        newdata[key - 1].isNew = false;
        newdata[key - 1].editable = false;
      } else {
        newdata[key - 1].deviceName = value;
      }
    };
    setData(newdata);
    ChangeValue(newdata);
  };

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
  // 编辑记录
  const editRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const indexNew = newData.filter(item => item.isNew);
    const target = getRowByKey(key, newData);
    if (target && indexNew.length === 0) {
      target.editable = true;
      setData(newData);
    }
  }
  // 保存记录
  const saveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    const targetval = Object.values(target);
    const Nullvalue = targetval.indexOf('');
    if (Nullvalue !== -1) {
      e.target.focus();
      return;
    }
    if (target && target.editable) {
      target.editable = !target.editable;
      setData(newData);
      ChangeValue(newData);
    }
    if (target && target.isNew) {
      target.isNew = !target.isNew;
      setData(newData);
      ChangeValue(newData);
    }
  };

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
        isNew: false,
        key: (index + 1).toString(),
      }));
      setData(newData)
    };
    // if (dataSource && dataSource.length === 0 && data.length === 0) {
    //   newMember()
    // }
  }, [dataSource]);

  useEffect(() => {
    if (taskName === '新建' && location && location.state && (location.state.cache || location.state.reset)) {
      setData([]);
    }
  }, [location]);

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
        if ((record.isNew || record.editable) && isEdit) {
          return (
            <>
              {/* <Select placeholder="请选择" onChange={v => handleChange(v, record.key)} value={text}>
                {statusY && statusY.map(obj => [
                  <Option key={obj.id} value={JSON.stringify(obj)}>
                    {obj.deviceName}
                  </Option>,
                ])}
              </Select> */}
              <AutoComplete
                dataSource={statusY && statusY.length && statusY.map(opt => (
                  <Option key={opt.id} value={opt.id}>
                    {opt.deviceName}
                  </Option>
                ))}
                style={{ width: 200 }}
                // onSelect={(v) => { handleChange(v, record.key) }}
                //  onChange={e => handleFieldChange(e, 'deviceName', record.key)}
                onChange={(v) => { handleChange(v, record.key) }}
                defaultValue={text}
              // filterOption
              />
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
      render: (text, record) => {
        if ((record.isNew || record.editable) && isEdit) {
          return (
            <TextArea
              defaultValue={text}
              rows={5}
              onChange={e => handleFieldChange(e.target.value, 'deviceConfig', record.key)}
            />)
        }
        return (<span dangerouslySetInnerHTML={{ __html: text?.replace(/[\n]/g, '<br/>') }} />)
      }
    },
    {
      title: '部署应用',
      dataIndex: 'deployApp',
      key: 'deployApp',
      render: (text, record) => {
        if ((record.isNew || record.editable) && isEdit) {
          return (
            <TextArea
              defaultValue={text}
              rows={5}
              onChange={e => handleFieldChange(e.target.value, 'deployApp', record.key)}
            />)
        }
        return (<span dangerouslySetInnerHTML={{ __html: text?.replace(/[\n]/g, '<br/>') }} />)
      }
    },
  ];


  return (
    <>
      <Row style={{ paddingBottom: 8 }}>
        <h4 style={{ float: 'left' }}><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{title}</h4>
        <div style={{ float: 'right' }}>
          {isEdit && (<>
            <Button
              type='primary'
              style={{ marginRight: 8 }}
              onClick={() => newMember()}
            >新增</Button>
            <Button type='danger' style={{ marginRight: 8 }} ghost onClick={() => handelDelete()}>移除</Button>
          </>)}
          <Button
            type="primary"
            ghost
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
          </Button>
        </div>
      </Row>
      <Table
        columns={columns}
        dataSource={!expand && data.length > 0 ? [data[0]] : data}
        bordered
        size='middle'
        rowKey={(_, index) => index.toString()}
        onRow={record => {
          return {
            onDoubleClick: e => { if (isEdit) { editRow(e, record.key) } },          // 双击行编辑
            onMouseLeave: e => { if (isEdit) { saveRow(e, record.key) } },           // 鼠标移出行
          };
        }}
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