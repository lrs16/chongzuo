import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import KeyVal from '@/components/SysDict/KeyVal';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statemap = [
  { key: '0', value: '需求登记' },
  { key: '1', value: '业务科室领导审核' },
  { key: '2', value: '系统开发商审核' },
  { key: '3', value: '自动化科专责审核' },
  { key: '4', value: '自动化科业务人员审核' },
  { key: '5', value: '市场部领导审核' },
  { key: '6', value: '科室领导审核' },
  { key: '7', value: '系统开发商处理' },
  { key: '8', value: '自动化科负责人确认' },
  { key: '9', value: '需求登记人员确认' },
  { key: '10', value: '已完成' },
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const form10ladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const columns = [
  {
    title: '需求编号',
    dataIndex: 'demandId',
    key: 'demandId',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/demandmanage/query/details`,
          query: {
            taskId: record.taskId,
            mainId: record.processInstanceId,
            taskName: record.taskName,
            No: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
  },
  {
    title: '需求类型',
    dataIndex: 'demandType',
    key: 'demandType',
  },
  {
    title: '申请人',
    dataIndex: 'proposer',
    key: 'proposer',
  },
  {
    title: '工单状态',
    dataIndex: 'taskName',
    key: 'taskName',
  },

  {
    title: '登记人',
    dataIndex: 'sender',
    key: 'sender',
  },
  {
    title: '创建时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    render: text => {
      return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
  },
];

let queryParams = true;
function QueryList(props) {
  // const pagetitle = props.route.name;
  const {
<<<<<<< HEAD
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
=======
    form: { getFieldDecorator, resetFields, validateFields, getFieldsValue },
>>>>>>> 框架多页签：标签表历史（需求登记完成）
    location: { query: { module, taskName, startTime, endTime, completeStatus } },
    loading,
    list,
    dispatch,
    location,
  } = props;
  let title;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');

  if (module || taskName || completeStatus) {
    title = '需求统计查询'
  } else {
    title = '需求查询'
  }

  useEffect(() => {
    setFieldsValue(
      {
        module,
        taskName,
        completeStatus
      }
    )
    if (startTime) {
      setFieldsValue({
        createTime: [moment(startTime), moment(endTime)] || '',
      })
    }
  }, [])

  useEffect(() => {
    queryParams = true;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'demandquery/querylist',
          payload: {
            ...values,
            page: paginations.current,
            limit: paginations.pageSize,
            startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            sendTime: values.sendTime ? moment(values.sendTime).format('YYYY-MM-DD HH:mm:ss') : '',
          },
        });
      }
    });
  }, []);

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'demandquery/querylist',
      payload: {
        ...values,
        limit: size,
        page,
        startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        sendTime: values.sendTime ? moment(values.sendTime).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size);
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
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

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, 0, paginations.pageSize);
    });
  };

  const handleReset = () => {
    queryParams = false;
    resetFields();
  };

  const download = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'demandquery/download',
        payload: {
          ...values,
          startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          sendTime: values.sendTime ? values.sendTime.format('YYYY-MM-DD HH:mm:ss') : '',
        }
      }).then(res => {
        const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });

    })

  };

  // 打开多页签，表单信息传回tab
  useEffect(() => {
    if (location.state.cache) {
      const values = getFieldsValue();
      dispatch({
        type: 'viewcache/gettabstate',
        payload: {
          cacheinfo: {
            ...values,
            page: paginations.current,
            limit: paginations.pageSize,
            module,
            taskName,
            startTime: startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            completeStatus,
          },
          tabid: sessionStorage.getItem('tabid')
        },
      });
    }
  }, [location.state]);

  console.log(location.state)
  const cacheinfo = location.state.cacheinfo === undefined ? {} : location.state.cacheinfo;

  return (
    <PageHeaderWrapper title={title}>
      <KeyVal
        style={{ display: 'none' }}
        dictModule="demand"
        dictType="source"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
<<<<<<< HEAD
            {expand === false && (
              <>
                {(module || taskName ||completeStatus) && (
                  <>
                    <Col span={8}>
                      <Form.Item label="当前处理环节">
                        {getFieldDecorator('taskName', { initialValue: '' })(
                          <Select placeholder="请选择" allowClear>
                            {statemap.map(({ key, value }) => (
                              <Option key={key} value={value}>
                                {value}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="功能模块">
                        {getFieldDecorator('module', { initialValue: '' })(
                          <Input />,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="超时状态">
                        {getFieldDecorator('status', { initialValue: '' })(
                          <Input />,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={10}>
                      <Form.Item label="建单时间" {...{ ...form10ladeLayout }}>
                        {getFieldDecorator('createTime', {
                          initialValue: '',
                        })(<RangePicker
                          showTime
                          format='YYYY-MM-DD HH:mm:ss'
                          allowClear
                        />)}
                      </Form.Item>
                    </Col>
                  </>
                )}

                {(!module && !taskName && !completeStatus) && (
                  <>
                    <Col span={8}>
                      <Form.Item label="需求编号">
                        {getFieldDecorator('demandId', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="当前处理环节">
                        {getFieldDecorator('taskName', { initialValue: '' })(
                          <Select placeholder="请选择" allowClear>
                            {statemap.map(({ key, value }) => (
                              <Option key={key} value={value}>
                                {value}
                              </Option>
                            ))}
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="需求标题">
                        {getFieldDecorator('demandTitle', {
                          initialValue: '',
                        })(<Input placeholder="请输入" allowClear />)}
                      </Form.Item>
                    </Col>
                  </>
=======
            <Col span={8}>
              <Form.Item label="需求编号">
                {getFieldDecorator('demandId', {
                  initialValue: cacheinfo.demandId,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('taskName', { initialValue: cacheinfo.taskName })(
                  <Select placeholder="请选择" allowClear>
                    {statemap.map(({ key, value }) => (
                      <Option key={key} value={value}>
                        {value}
                      </Option>
                    ))}
                  </Select>,
>>>>>>> 框架多页签（需求完成）
                )}
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="需求编号">
                    {getFieldDecorator('demandId', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="当前处理环节">
                    {getFieldDecorator('taskName', { initialValue: '' })(
                      <Select placeholder="请选择" allowClear>
                        {statemap.map(({ key, value }) => (
                          <Option key={key} value={value}>
                            {value}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="需求标题">
<<<<<<< HEAD
                    {getFieldDecorator('demandTitle', {
                      initialValue: '',
=======
                    {getFieldDecorator('title', {
                      initialValue: cacheinfo.title,
>>>>>>> 框架多页签（需求完成）
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="需求类型">
                    {getFieldDecorator('demandType', { initialValue: cacheinfo.demandType })(
                      <Select placeholder="请选择" allowClear>
                        {selectdata.source.map(obj => (
                          <Option key={obj.key} value={obj.val}>
                            {obj.val}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerPerson', {
                      initialValue: cacheinfo.registerPerson,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="创建时间">
                    {getFieldDecorator('sendTime')(<DatePicker allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={24} style={{ paddingTop: 4,textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关 闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展 开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}
            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关 闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展 开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>
            {' '}
            导出数据
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ demandquery, loading }) => ({
    list: demandquery.list,
    loading: loading.models.demandquery,
  }))(QueryList),
);
