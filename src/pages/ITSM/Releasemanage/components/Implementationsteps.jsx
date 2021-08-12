import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Checkbox, Input, Divider, message } from 'antd';
import styles from '../index.less';


const startData = [
  { key: 1, rowtitle: '一、实施前准备', stepType: '实施前准备' },
  { key: 2, rowtitle: '二、实施过程', stepType: '实施过程' },
  { key: 3, rowtitle: '三、实施后', stepType: '实施后' },
]

function Implementationsteps(props) {
  const { title, isEdit, dataSource, ChangeValue } = props;
  const [data, setData] = useState([

  ]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 新增一条记录
  const newMember = (value, stepType) => {
    const newData = data.map(item => ({ ...item }));
    const num2 = newData.findIndex((ele) => {
      return ele.rowtitle === '二、实施过程'
    });
    const num3 = newData.findIndex((ele) => {
      return ele.rowtitle === '三、实施后'
    });
    const vote = {
      key: newData.length + 1,
      stepType,
      step: '',
      riskNotice: '',
      director: '',
      chaperone: '',
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
    if (!target.step || !target.riskNotice || !target.director || !target.chaperone) {
      message.error('请填写完整信息。');
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

  useEffect(() => {
    if (dataSource && dataSource.length === 0) {
      setData(startData)
    } else {
      setData(dataSource)
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
          <>
            <div style={{ marginTop: 6, float: 'left' }}>{record.rowtitle}</div>
            {isEdit && (
              <div style={{ float: 'right' }}>
                <Button
                  type='primary'
                  style={{ marginRight: 8 }}
                  onClick={() => newMember(record.rowtitle, record.stepType)}
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
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'step', record.key)}
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
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'riskNotice', record.key)}
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
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'director', record.key)}
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
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'chaperone', record.key)}
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