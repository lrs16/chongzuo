import React, { useState } from 'react';
import { Table, Button, Row, Checkbox, Input, Divider, message } from 'antd';
import styles from '../index.less';

function Implementationsteps(props) {
  const { title, isEdit } = props;
  const [data, setData] = useState([
    { key: 1, rowtitle: '一、实施前准备' },
    {
      key: 2,
      rowkey: 1,
      type: '实施前准备',
      steps: '实施方案编制',
      risk: '风险大了去',
      charge: '王重阳',
      confirm: '确认已完成',
    },
    {
      key: 3,
      rowkey: 2,
      type: '实施前准备',
      steps: '实施方案编制',
      risk: '风险大到不能再大',
      charge: '王重阳',
      confirm: '确认已完成',
    },
    { key: 4, rowtitle: '二、实施过程' },
    {
      key: 5,
      rowkey: 1,
      type: '实施过程',
      steps: '这表格太BT',
      risk: '风险大了去',
      charge: '王重阳',
      confirm: '确认已完成',
    },
    { key: 6, rowtitle: '三、实施后' },
  ]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 新增一条记录
  const newMember = (value) => {
    const newData = data.map(item => ({ ...item }));
    const num2 = newData.findIndex((ele) => {
      return ele.rowtitle === '二、实施过程'
    });
    const num3 = newData.findIndex((ele) => {
      return ele.rowtitle === '三、实施后'
    });
    const vote = {
      key: newData.length + 1,
      type: '',
      steps: '',
      risk: '',
      charge: '',
      confirm: '',
      editable: false,
      isNew: true,
    };
    switch (value) {
      case '一、实施前准备':
        newData.splice(num2, 0, {
          rowkey: newData[num2 - 1].rowkey !== undefined ? num2 : 1,
          ...vote,
        });
        break;
      case '二、实施过程':
        newData.splice(num3, 0, {
          rowkey: newData[num3 - 1].rowkey !== undefined ? newData[num3 - 1].rowkey + 1 : 1,
          ...vote,
        });
        break;
      case '三、实施后':
        newData.push({
          rowkey: newData.slice(-1)[0].rowkey !== undefined ? newData.slice(-1)[0].rowkey + 1 : 1,
          ...vote,
        });
        break;
      default:
        break;
    };
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
      target.editable = true;
      setData(newData);
    }
  }


  // 保存记录
  const saveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (!target.steps || !target.risk || !target.risk) {
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

  const columns = [
    {
      title: '',
      dataIndex: 'selectbox',
      key: 'selectbox',
      width: 40,
      render: (_, record) => {
        const rowtitles = (
          <>
            <div style={{ marginTop: 6, float: 'left' }}>{record.rowtitle}</div>
            {isEdit && (
              <div style={{ float: 'right' }}>
                <Button
                  type='primary'
                  style={{ marginRight: 8 }}
                  onClick={() => newMember(record.rowtitle)}
                  disabled={newbutton}
                >
                  新增
                </Button>
                <Button type='danger' style={{ marginRight: 8 }} ghost>移除</Button>
              </div>
            )}
          </>
        )
        if (record.rowtitle) {
          return {
            children: rowtitles,
            props: {
              colSpan: 7,
            }
          }
        } if (!record.isNew) {
          return <Checkbox />
        }
        return null;
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
      dataIndex: 'steps',
      key: 'steps',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'steps', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <>{text}</>
      }
    },
    {
      title: '风险及注意事项',
      dataIndex: 'risk',
      key: 'risk',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'risk', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <>{text}</>
      }
    },
    {
      title: '负责人',
      dataIndex: 'charge',
      key: 'charge',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'charge', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <>{text}</>
      }
    },
    {
      title: '安全监护人确认完成情况',
      dataIndex: 'confirm',
      key: 'confirm',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'confirm', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return <>{text}</>
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => {
        if (record.rowtitle) {
          return {
            props: {
              colSpan: 0,
            }
          }
        } if (record.isNew) {
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
        );
      }
    },
  ];

  const sclicecolumns = (arr) => {
    const newarr = arr.slice(0);
    newarr.pop();
    return newarr;
  }
  const viewcolumns = sclicecolumns(columns);

  return (
    <>
      <Row style={{ marginBottom: 8 }}>
        <h4 style={{ float: 'left' }}><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{title}</h4>
      </Row>
      <Table
        columns={isEdit ? columns : viewcolumns}
        dataSource={data}
        bordered
        size='middle'
        pagination={false}
        defaultExpandAllRows
        rowKey={(_, index) => index.toString()}
      />
    </>
  );
}

export default Implementationsteps;