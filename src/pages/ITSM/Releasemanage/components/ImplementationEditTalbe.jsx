import React, { useEffect, useState } from 'react';
import { Row, Button, Input, Table, Divider, message } from 'antd';
import styles from '../index.less';

function ImplementationEditTalbe(props) {
  const { title, isEdit, tablecolumns, dataSoure } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const newData = dataSoure.map(item => ({ ...item }));
    setData(newData)
  }, [])

  // 新增一条记录
  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      t1: '',
      t2: '',
      t3: '',
      t4: '',
      t5: '',
      t6: '',
      editable: false,
      isNew: true,
    });
    setData(newData);
    setNewButton(true);
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

  // 点击编辑按钮
  const editRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target.editable = !target.editable;
      setData(newData);
    }
  }


  // 保存记录
  const saveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (!target.t2 || !target.t3) {
      message.error('请填写完整信息。');
      e.target.focus();
      return;
    }
    // delete target.key;
    if (target && target.editable) {
      target.editable = !target.editable;
      setData(newData);
    }
    if (target && target.isNew) {
      target.isNew = !target.isNew;
      setNewButton(false)
      setData(newData);
    }
    // const id = target.id === '' ? '' : target.id;
    // savedata(target, id);
  };

  // 取消按钮
  const cancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    const newArr = newData.filter(item => item.key !== target.key);
    setData(newArr);
    setNewButton(false);
  };

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys)
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
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    });
    if (isEdit) {
      newArr.push(
        {
          title: '操作',
          key: 'action',
          width: 120,
          align: 'center',
          render: (text, record) => {
            if (record.isNew) {
              return (
                <>
                  <Button type='link' onClick={e => saveRow(e, record.key)} style={{ padding: '0 4px' }}>保存</Button>
                  <Divider type="vertical" />
                  <Button type='link' onClick={e => cancel(e, record.key)} style={{ padding: '0 4px' }}>取消</Button>
                </>
              );
            } if (record.editable) {
              return (
                <Button type='link' onClick={e => saveRow(e, record.key)} style={{ padding: '0 4px' }}>保存</Button>
              );
            }
            return (
              <Button type='link' onClick={e => editRow(e, record.key)} style={{ padding: '0 4px' }}>编辑</Button>
            )

          },
        }
      )
    }
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
          <Button type='danger' style={{ marginRight: 8 }} ghost>移除</Button>
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
        rowKey={(_, index) => index.toString()}
      />
    </>
  );
}
ImplementationEditTalbe.defaultProps = {
  dataSoure: [],
};

export default ImplementationEditTalbe;