import React, { useEffect, useState } from 'react';
import { Row, Button, Input, Table, Divider, message } from 'antd';
import styles from '../index.less';

function ImplementationEditTalbe(props) {
  const { title, isEdit, tablecolumns, dataSource, newkeys, ChangeValue, } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  // 新增一条记录
  const newMember = () => {
    const newData = data.map((item, index) => ({
      ...item,
      editable: false,
      key: (index + 1).toString(),
    }));
    newData.push({
      key: (data.length + 1).toString(),
      ...newkeys,
      editable: false,
      isNew: true,
    });
    setData(newData);
    setNewButton(true);
  };

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        editable: false,
        key: (index + 1).toString(),
      }));
      setData(newData);
      setNewButton(false);
    };
  }, [dataSource])

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
    setNewButton(true);
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
      setNewButton(false);
    }
    if (target && target.isNew) {
      target.isNew = !target.isNew;
      setData(newData);
      ChangeValue(newData);
      setNewButton(false);
    }
  };

  // 移除
  const handleDelete = () => {
    if (selectedRecords.length === 0) {
      message.error('您还没有选择数据')
    };
    const arr = []
    data.forEach(item => {
      if (!selectedRowKeys.includes(item.key)) {
        arr.push(item)
      }
    });
    setData(arr);
    ChangeValue(arr);
    setSelectedRowKeys([]);
    setSelectedRecords([]);
    setNewButton(false);
  }

  const onSelectChange = (RowKeys, RowRecords) => {
    setSelectedRowKeys(RowKeys)
    setSelectedRecords(RowRecords)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const editrow = (text, key, rowkey) => (
    <div className={text === '' ? styles.requiredform : ''}>
      <Input
        onChange={e => handleFieldChange(e.target.value, key, rowkey)}
        defaultValue={text}
        placeholder="请输入"
      />
    </div>
  )
  const tableColumns = () => {
    const newArr = [];
    if (!Array.isArray(tablecolumns)) {
      return newArr;
    }
    for (let i = 0; i < tablecolumns.length; i += 1) {
      const vote = {};
      vote.title = tablecolumns[i].title;
      vote.dataIndex = tablecolumns[i].key;
      vote.key = tablecolumns[i].key;
      vote.render = (text, record) => {
        if (record.isNew || record.editable) {
          return editrow(text, tablecolumns[i].key, record.key)
        }
        return text;
      }
      newArr.push(vote);
    };
    newArr.unshift({
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      align: 'center',
    });
    return newArr;
  };

  return (
    <>
      <Row style={{ marginBottom: 8 }}>
        <h4 style={{ float: 'left' }}><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{title}</h4>
        {isEdit && (<div style={{ float: 'right' }}>
          <Button
            type='primary'
            style={{ marginRight: 8 }}
            onClick={() => newMember()}
            disabled={newbutton}
          >新增</Button>
          <Button type='danger' style={{ marginRight: 8 }} ghost onClick={() => handleDelete()}>移除</Button>
        </div>
        )}
      </Row>
      <Table
        columns={tableColumns()}
        dataSource={data}
        bordered
        size='middle'
        pagination={false}
        rowSelection={rowSelection}
        rowKey={record => record.key}
        onRow={record => {
          return {
            onClick: e => { if (isEdit) { editRow(e, record.key) } },          // 点击行编辑
            onMouseLeave: e => { if (isEdit) { saveRow(e, record.key) } },    // 鼠标移出行
          };
        }}
      />
    </>
  );
}
ImplementationEditTalbe.defaultProps = {
  dataSoure: [],
};

export default ImplementationEditTalbe;