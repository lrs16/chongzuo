import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import { mergeOrders } from './services/api';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function ToDolist(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, getFieldsValue },
    loading,
    list,
    dispatch,
    location,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  // 查询
  const searchdata = (values, page, size) => {
    dispatch({
      type: 'releasetodo/fetchlist',
      payload: {
        ...values,
        benginTime: values.benginTime ? moment(values.benginTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        pageSize: size,
        pageIndex: page,
      },
    });
  };

  useEffect(() => {
    const values = getFieldsValue();
    searchdata(values, paginations.current, paginations.pageSize);
    return () => {
      setSelectData([]);
      setExpand(false);
    };
  }, [location]);

  //  下载
  const download = () => {
    const values = getFieldsValue();
    dispatch({
      type: 'releasetodo/eventdownload',
      payload: {
        values,
        ids: selectedRowKeys.toString(),
      },
    }).then(res => {
      const filename = `事件待办_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const onShowSizeChange = (page, size) => {
    const values = getFieldsValue();
    searchdata(values, page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    searchdata(values, page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    const values = getFieldsValue();
    searchdata(values, paginations.current, paginations.pageSize);
  };

  const handleReset = () => {
    resetFields();
  };

  const handleApproval = () => {
    if (selectedRecords.length === 0 || selectedRecords.length === 1) {
      message.error('请选择多条数据')
    } else {
      const target = selectedRecords.filter(item => item.taskName === '版本管理员审核' && item.releaseType === '计划发布');
      if (target.length > 0) {
        const releaseNos = target.map((obj) => {
          return obj.releaseNo;
        });
        if (releaseNos.length > 1) {
          mergeOrders({ releaseNo: releaseNos.toString() }).then(res => {
            if (res.code === 200) {
              message.success('工单合并成功');
              // const values = getFieldsValue();
              // searchdata(values, paginations.current, paginations.pageSize);
              router.push({
                pathname: `/ITSM/releasemanage/to-do/record`,
                query: {
                  taskName: '版本管理员审核',
                  Id: target[0].releaseNo,
                  taskId: target[0].taskId,
                  releaseType: target[0].releaseType,
                },
                state: {
                  dynamicpath: true,
                  menuDesc: '发布工单',
                }
              });
            }
          })
        } else {
          message.error('请选择多条当前处理环节为‘版本管理员审核’且发布类型为‘计划发布’的工单')
        }
      } else {
        message.error('请选择当前处理环节为‘版本管理员审核’且发布类型为‘计划发布’的工单')
      }
    };
    setSelectedRowKeys([]);
    setSelectedRecords([]);
  }

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId('1384055209809940482');       // 发布类型
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const statumap = getTypebyId('1385066256880635905');       // 处理环节

  const columns = [
    {
      title: '发布编号',
      dataIndex: 'releaseNo',
      key: 'releaseNo',
      fixed: 'left',
      render: (text, record) => {
        const handleClick = () => {
          router.push({
            pathname: `/ITSM/releasemanage/to-do/record`,
            query: {
              taskName: record.taskName,
              Id: record.releaseNo,
              taskId: record.taskId,
              releaseType: record.releaseType,
            },
            state: {
              dynamicpath: true,
              menuDesc: '发布工单',
            }
          });
        };
        return (<a onClick={handleClick}>{text}</a>);
      },
      sorter: (a, b) => a.releaseNo.localeCompare(b.releaseNo),
    },
    {
      title: '合并单号',
      dataIndex: 'mergeNo',
      key: 'mergeNo',
      render: (text, record) => {
        return (<>{record.taskName === '版本管理员审核' ? text : ''}</>)
      }
    },
    {
      title: '当前处理环节',
      dataIndex: 'taskName',
      key: 'taskName',
      sorter: (a, b) => a.taskName.localeCompare(b.taskName),
    },
    {
      title: '发布类型',
      dataIndex: 'releaseType',
      key: 'releaseType',
      width: 200,
      sorter: (a, b) => a.releaseType.localeCompare(b.releaseType),
    },
    {
      title: '责任单位',
      dataIndex: 'dutyUnit',
      key: 'dutyUnit',
      sorter: (a, b) => a.dutyUnit.localeCompare(b.dutyUnit),
    },
    {
      title: '出厂测试登记人',
      dataIndex: 'registerUser',
      key: 'registerUser',
      sorter: (a, b) => a.registerUser.localeCompare(b.registerUser),
    },
    {
      title: '发送人',
      dataIndex: 'sender',
      key: 'sender',
      sorter: (a, b) => a.sender.localeCompare(b.sender),
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      sorter: (a, b) => a.sendTime.localeCompare(b.sendTime),
    },
  ];

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  )

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="发布编号">
                {getFieldDecorator('releaseNo', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('releaseStatus', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {statumap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="责任单位">
                    {getFieldDecorator('dutyUnit', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择" allowClear>
                        {unitmap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发布类型">
                    {getFieldDecorator('releaseType', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择" allowClear>
                        {typemap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="出厂测试登记人">
                    {getFieldDecorator('register', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator('sender', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发送时间">
                    <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('beginTime', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('00:00:00', 'HH:mm:ss'),
                          }}
                          placeholder="开始时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </Form.Item>
                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                    <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                      {getFieldDecorator('endTime', {
                        initialValue: '',
                      })(
                        <DatePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: moment('23:59:59', 'HH:mm:ss'),
                          }}
                          placeholder="结束时间"
                          format='YYYY-MM-DD HH:mm:ss'
                          style={{ minWidth: 120, width: '100%' }}
                        />
                      )}
                    </Form.Item>
                  </Form.Item>
                </Col>
              </>
            )}
            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
          <Button type="primary" onClick={() => handleApproval()} >版本管理员合并审核</Button >
        </div>
        < Table
          loading={loading}
          columns={columns}
          dataSource={list.records}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={(_, index) => index.toString()}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(ToDolist),
);
