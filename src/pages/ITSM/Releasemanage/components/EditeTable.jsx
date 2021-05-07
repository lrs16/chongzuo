import React, { useState, useEffect } from 'react';
import { Table, Row, Button, Col, Cascader, Input, Radio, message, Divider, Select, Tabs } from 'antd';
import styles from '../index.less';
import AssignmentModal from './AssignmentModal';
import OrderContent from './OrderContent';

const dataSource = [{
  key: 1,
  t0: '计划',
  t1: '前台功能/变弄功能',
  t2: 'ITSM',
  t3: 'ITSM',
  t4: '用于创建一个实体或收集信息。需要对输入的数据类型进行校验时。',
  menu: '运维管理->指标统计->终端运维->采集完整率(新)->零点失败列表补招（按钮）、非零点失败列表补招（按钮）。',
  des: '实现按供电单位进行失败列表的曲线批量召测功能。',
  step: '运维管理->指标统计->终端运维->采集完整率->零点失败列表补招、非零点失败列表补招',
  t6: '通过',
  t7: '张晓晓',
  t8: sessionStorage.getItem('userName'),
  t9: '1132',
}]

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TabPane } = Tabs;

function EditeTable(props) {
  const { title, functionmap, modulamap, isEdit, listType, taskName, mainId } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visible, setVisible] = useState(false);                    // 分派窗口是否显示
  const [drawervisible, setDrawerVisible] = useState(false);        // 工单详情窗口是否显示

  useEffect(() => {
    setData([...dataSource])
  }, [])

  // 新增一条记录
  const newMember = () => {
    // setFilesList([]);
    // setKeyUpload('');
    //  const newData = data.map(item => ({ ...item }));
    data.push({
      key: data.length + 1,
      t0: listType,
      t1: '',
      t2: '',
      t3: '',
      t4: '',
      t5: '',
      t6: '001',
      t7: '',
      t8: sessionStorage.getItem('userName'),
      t9: mainId,
      editable: false,
      isNew: true,
    });
    //  setData(newData);
    setNewButton(true);
  };

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
    // const target = getRowByKey(key);
    // if (target) {
    //   data[key - 1].editable = true;
    //   data[key - 1].isNew = false;
    // }
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

  const hadleAssignment = () => {
    setVisible(true)
  }

  const column = [
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
      title: '清单类型',
      dataIndex: 't0',
      key: 't0',
      width: 100,
      render: (text) => {
        return text
      }
    },
    {
      title: '功能类型',
      dataIndex: 't1',
      key: 't1',
      width: 200,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <Cascader
                fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                options={functionmap}
                defaultValue={record.isNew ? [] : text.split('/')}
                onChange={e => handleFieldChange(e, 't1', record.key)}

              />
            </div>
          )
        }
        return text
      }
    },
    {
      title: '模块',
      dataIndex: 't2',
      key: 't2',
      width: 100,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredselect : ''}>
              <Select
                defaultValue={record.t2}
                placeholder="请选择"
                onChange={e => handleFieldChange(e, 't2', record.key)}
              >
                {modulamap.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '功能名称',
      dataIndex: 't3',
      key: 't3',
      width: 80,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 't3', record.key)}
                defaultValue={record.t3}
                placeholder="请输入"
              />
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '问题类型',
      dataIndex: 't4',
      key: 't4',
      width: 150,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <TextArea
                defaultValue={text}
                autoSize
                placeholder="请输入"
                onChange={e => handleFieldChange(e.target.value, 't4', record.key)}
              />
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '测试内容及预期效果',
      dataIndex: 't5',
      key: 't5',
      width: 400,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <InputGroup compact style={{ marginBottom: 12 }}>
                <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>功能菜单：</span>
                <TextArea
                  defaultValue={record.menu}
                  autoSize
                  style={{ width: 330 }}
                  onChange={e => handleFieldChange(e.target.value, 'menu', record.key)}
                />
              </InputGroup>
              <InputGroup compact style={{ marginBottom: 12 }}>
                <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>预期效果：</span>
                <TextArea
                  defaultValue={record.des}
                  autoSize
                  style={{ width: 330 }}
                  onChange={e => handleFieldChange(e.target.value, 'menu', record.key)}
                />
              </InputGroup>
              <InputGroup compact>
                <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>验证步骤：</span>
                <TextArea
                  defaultValue={record.step}
                  autoSize
                  style={{ width: 330 }}
                  onChange={e => handleFieldChange(e.target.value, 'menu', record.key)}
                />
              </InputGroup>
            </div>
          )
        }
        return (
          <>
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>功能菜单：</span>
              <span style={{ width: 330 }}>{record.menu}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
              <span style={{ width: 330 }}>{record.des}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
              <span style={{ width: 330 }}>{record.step}</span>
            </InputGroup>
          </>
        );
      }
    },
    {
      title: '是否通过',
      dataIndex: 't6',
      key: 't6',
      width: 80,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <>
              <RadioGroup value={text}>
                <Radio value='001'>通过</Radio>
                <Radio value='002'>不通过</Radio>
              </RadioGroup>
            </>
          )
        }
        return text;
      }
    },
    {
      title: '开发人员',
      dataIndex: 't7',
      key: 't7',
      width: 100,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
              <TextArea
                defaultValue={text}
                autoSize
                placeholder="请输入"
                onChange={e => handleFieldChange(e.target.value, 't7', record.key)}
              />
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '操作人员',
      dataIndex: 't8',
      key: 't8',
      align: 'center',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 60,
      align: 'center',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <>
              <Button type='link' onClick={e => saveRow(e, record.key)}>保存</Button>
              <Divider type="vertical" />
              <Button type='link' onClick={e => cancel(e, record.key)}>取消</Button>
            </>
          );
        } if (record.editable) {
          return (
            <Button type='link' onClick={e => saveRow(e, record.key)}>保存</Button>
          );
        }
        return (
          <>
            {taskName !== '版本管理员审批' && record.t0 === '计划' && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '版本管理员审批' && record.t0 === '临时' && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '版本管理员审批' && record.t0 === '计划' && (<Button type='link' >回退</Button>)}
          </>
        )

      },
    },
  ];

  const orderid = {
    title: '所属工单',
    dataIndex: 't9',
    key: 't9',
    fixed: 'right',
    width: 100,
    align: 'center',
    render: (text) => {
      return <a onClick={() => setDrawerVisible(true)}>{text}</a>
    }
  };

  const addorderid = (arr) => {
    const newarr = arr.slice(0);
    if (taskName === '版本管理员审批') {
      newarr.splice(-1, 0, orderid);
    };
    return newarr
  };
  const columns = addorderid(column);

  const sclicecolumns = (arr) => {
    const newarr = arr.slice(0);
    newarr.pop();
    return newarr;
  }
  const viewcolumns = sclicecolumns(columns);

  return (
    <>
      <h4>
        {(taskName === '发布登记' || taskName === '平台验证' || taskName === '业务验证') && (
          <span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>
        )}
        {title}
      </h4>
      {(taskName === '版本管理员审批' || taskName === '科室负责人审批' || taskName === '中心领导审批' || taskName === '业务复核') && (
        <Tabs type='card'>
          <TabPane tab='博联' key='1' />
          <TabPane tab='南瑞' key='2' />
        </Tabs>
      )}
      <Row style={{ marginBottom: 8 }} type='flex' align='bottom'>
        <Col span={18}>

          <span><b>前台功能统计：</b>
          缺陷修复项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          变更功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。
          <b>后台功能统计：</b>
          缺陷修复<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          变更功能<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。</span>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          {isEdit && (
            <>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                onClick={() => newMember()}
                disabled={newbutton}
              >新增</Button>
              <Button type='danger' style={{ marginRight: 8 }} ghost>移除</Button>
            </>
          )}
          {taskName === '业务复核' && (
            <Button
              type='primary'
              style={{ marginRight: 8 }}
              onClick={() => hadleAssignment()}
              disabled={newbutton}
            >
              分派
            </Button>
          )}
          <Button type='primary' >导出清单</Button>
        </Col>
      </Row>
      <Table
        columns={isEdit ? columns : viewcolumns}
        dataSource={data}
        bordered
        size='middle'
        rowKey={(_, index) => index.toString()}
        pagination={false}
        rowSelection={rowSelection}
        scroll={{ x: 1500 }}
      />
      <AssignmentModal visible={visible} handleChange={v => setVisible(v)} />
      <OrderContent visible={drawervisible} handleChange={v => setDrawerVisible(v)} />
    </>
  );
}

export default EditeTable;