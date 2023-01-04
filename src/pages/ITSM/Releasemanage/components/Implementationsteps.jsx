import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Checkbox, Input, Divider, message, Col, Dropdown, Menu, Icon } from 'antd';
import styles from '../index.less';

const startData = [
  { key: 1, rowtitle: '一、实施前准备' },
  { key: 2, rowtitle: '二、实施过程' },
  { key: 3, rowtitle: '三、实施后' },
]

function Implementationsteps(props) {
  const { title, isEdit, dataSource, ChangeValue } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 复选
  const handleCheck = (checkedValues) => {
    setSelectedRowKeys(checkedValues)
  }

  // 新增一条记录
  const newMember = (value) => {
    setSelectedRowKeys([]);
    const newData = data.map(item => ({ ...item }));
    const num2 = newData.findIndex((ele) => {
      return ele.rowtitle === '二、实施过程'
    });
    const num3 = newData.findIndex((ele) => {
      return ele.rowtitle === '三、实施后'
    });
    const vote = {
      key: newData.length + 1,
      stepType: value,
      step: '',
      riskNotice: '',
      director: '',
      chaperone: '',
      editable: false,
      isNew: true,
    };
    switch (value) {
      case '实施前准备':
        newData.splice(num2, 0, {
          rowkey: newData[num2 - 1].rowkey !== undefined ? num2 : 1,
          ...vote,
        });
        break;
      case '实施过程':
        newData.splice(num3, 0, {
          rowkey: newData[num3 - 1].rowkey !== undefined ? newData[num3 - 1].rowkey + 1 : 1,
          ...vote,
        });
        break;
      case '实施后':
        newData.push({
          rowkey: newData.slice(-1)[0].rowkey !== undefined ? newData.slice(-1)[0].rowkey + 1 : 1,
          ...vote,
        });
        break;
      default:
        break;
    };
    const Arr = newData.map((item, index) => ({
      ...item,
      editable: false,
      key: index + 1,
    }));
    setData(Arr);
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
    if (!target.step || !target.riskNotice || !target.director || !target.chaperone) {
      // message.error('请填写完整信息。');
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
      setNewButton(false)
      setData(newData);
      ChangeValue(newData);
    }
  };

  // 移除
  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.error('您还没有选择数据')
    };
    const arr = [];
    data.forEach(item => {
      if (!selectedRowKeys.includes(item.key)) {
        arr.push(item)
      }
    });
    const indexNew = arr.filter(item => item.isNew);
    if (indexNew.length > 0) {
      setNewButton(true)
    } else {
      setNewButton(false)
    };
    const newArr = arr.map((item, index) => ({
      ...item,
      editable: false,
      key: index + 1,
    }));
    setData(newArr);
    ChangeValue(newArr);
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    if (dataSource && dataSource.length === 0) {
      setData(startData);
      ChangeValue(startData);
    } else {
      let i = 1;  // 实施前准备序号
      let j = 1;  // 实施过程序号
      let k = 1;  // 实施后序号
      const newArr = dataSource.map((item, index) => {
        let vote = {};
        if (item.rowtitle) {
          vote = {
            ...item,
            editable: false,
            key: index + 1,
          };
        } else {
          if (item.stepType === '实施前准备') {
            vote = {
              ...item,
              editable: false,
              key: index + 1,
              rowkey: i,
            };
            i += 1;
          };
          if (item.stepType === '实施过程') {
            vote = {
              ...item,
              editable: false,
              key: index + 1,
              rowkey: j,
            };
            j += 1;
          };
          if (item.stepType === '实施后') {
            vote = {
              ...item,
              editable: false,
              key: index + 1,
              rowkey: k,
            };
            k += 1;
          };
        };
        return vote
      })
      setData(newArr)

    }
  }, [dataSource])

  const columns = [
    {
      title: '',
      dataIndex: 'selectbox',
      key: 'selectbox',
      width: 40,
      render: (_, record) => {
        const rowtitles = (
          <div>
            <div style={{ float: 'left', padding: '12px 8px' }}>{record.rowtitle}</div>
          </div>
        )
        if (record.rowtitle) {
          return {
            children: rowtitles,
            props: {
              colSpan: 6,
            }
          }
        }
        return <div style={{ padding: '12px 8px' }}><Checkbox key={record.key} value={record.key} /></div>
      }
    },
    {
      title: '序号',
      dataIndex: 'rowkey',
      key: 'rowkey',
      align: 'center',
      width: 60,
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        }
        return <>{text}</>;
      }
    },
    {
      title: '操作步骤',
      dataIndex: 'step',
      key: 'step',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''} style={{ padding: '0 8px' }}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'step', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <div style={{ padding: '12px 8px' }} onClick={(e) => { if (isEdit && !record.rowtitle) { editRow(e, record.key) } }}>{text}</div>
      }
    },
    {
      title: '风险及注意事项',
      dataIndex: 'riskNotice',
      key: 'riskNotice',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''} style={{ padding: '0 8px' }} >
              <Input
                onChange={e => handleFieldChange(e.target.value, 'riskNotice', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <div style={{ padding: '12px 8px' }} onClick={(e) => { if (isEdit && !record.rowtitle) { editRow(e, record.key) } }}>{text}</div>
      }
    },
    {
      title: '负责人',
      dataIndex: 'director',
      key: 'director',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''} style={{ padding: '0 8px' }}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'director', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <div style={{ padding: '12px 8px' }} onClick={(e) => { if (isEdit && !record.rowtitle) { editRow(e, record.key) } }}>{text}</div>
      }
    },
    {
      title: '安全监护人确认完成情况',
      dataIndex: 'chaperone',
      key: 'chaperone',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''} style={{ padding: '0 8px' }}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'chaperone', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <div style={{ padding: '12px 8px' }} onClick={(e) => { if (isEdit && !record.rowtitle) { editRow(e, record.key) } }}>{text}</div>
      }
    },
  ];

  const sclicecolumns = (arr) => {
    const newarr = arr.slice(0);
    newarr.pop();
    return newarr;
  }
  const viewcolumns = sclicecolumns(columns);

  const handleMenuClick = (e) => {
    newMember(e.key)
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="实施前准备">
        实施前准备
      </Menu.Item>
      <Menu.Item key="实施过程">
        实施过程
      </Menu.Item>
      <Menu.Item key="实施后">
        实施后
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.pretable}>
      <Row style={{ marginBottom: 8 }}>
        <Col span={8}><h4 style={{ float: 'left' }}><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{title}</h4></Col>
        {isEdit && (<Col span={16} style={{ textAlign: 'right' }}>
          <Dropdown overlay={menu} disabled={newbutton}>
            <Button type='primary'>
              新增 <Icon type="down" />
            </Button>
          </Dropdown>
          <Button type='danger' style={{ marginLeft: 8 }} ghost onClick={() => handleDelete()}>移除</Button>
        </Col>
        )}
      </Row>
      <Checkbox.Group style={{ width: '100%' }} onChange={handleCheck} value={selectedRowKeys} >
        <Table
          columns={isEdit ? columns : viewcolumns}
          dataSource={data}
          bordered
          size='middle'
          pagination={false}
          defaultExpandAllRows
          rowKey={(_, index) => index.toString()}
          onRow={record => {
            return {
              // onMouseEnter: e => { if (isEdit && !record.rowtitle) { editRow(e, record.key) } },          // 点击行编辑
              onMouseLeave: e => { if (isEdit && !record.rowtitle) { saveRow(e, record.key) } },    // 鼠标移出行
            };
          }}
        />
      </Checkbox.Group>
    </div>
  );
}

export default Implementationsteps;