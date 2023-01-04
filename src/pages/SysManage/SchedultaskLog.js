import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Card, Row, Col, Form, Input, Select, Button, Table, Popconfirm, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { qrtzjoblogDelete } from './services/api';

const { Option } = Select;

const operations = <Button type="primary">
  <Link to="/sysmanage/timedtask">返回列表</Link>
</Button>;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const statusmap = [
  { key: '0', title: '暂停' },
  { key: '1', title: '正常' },
];

const taskName = [
  { key: '0', title: '默认' },
  { key: '1', title: '系统' },
];

function SchedultaskLog(props) {
  const pagetitle = props.route.name;
  const {
    loading,
    dispatch,
    location,
    location: {
      query: {
        Id,
      }
    },
    qrtzjobloglist,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    },
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.jobId = (Id !== '' || Id !== undefined) ? Id : '';
    dispatch({
      type: 'timedtaskmodel/toqueryqrtzjoblogList',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  useEffect(() => {
    searchdata(1, 15);
  }, [location]);

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const onShowSizeChange = (page, size) => {
    searchdata(1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(page, paginations.pageSize);
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
    total: qrtzjobloglist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  // 删除
  const handlelogDelete = id => {
    qrtzjoblogDelete(id).then(res => {
      if (res.code === 200) {
        message.success('删除成功');
        searchdata(1, 15);
      } else {
        message.error(res.msg);
      }
    });
  };

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  );

  const columns = [
    {
      title: '日志编号',
      dataIndex: 'jobLogId',
      key: 'jobLogId',
      width: 120,
      sorter: (a, b) => a.jobLogId - b.jobLogId,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      width: 250,
      ellipsis: true
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      key: 'jobGroup',
      width: 250,
      ellipsis: true,
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
      key: 'invokeTarget',
      width: 350,
      ellipsis: true,
    },
    {
      title: '日志信息',
      dataIndex: 'jobMessage',
      key: 'jobMessage',
      width: 350,
      ellipsis: true,
    },
    {
      title: '异常信息',
      dataIndex: 'exceptionInfo',
      key: 'exceptionInfo',
      width: 200,
      ellipsis: true,
    },
    {
      title: '执行状态',
      dataIndex: 'statusExt',
      key: 'statusExt',
      width: 100,
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record) => {
        return (
          <div>
            <Popconfirm title="确定删除吗？" onConfirm={() => handlelogDelete(record.jobLogId)}>
              <a type="link" style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle} onBack={() => window.history.back()} extra={operations}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="任务名称">
                {getFieldDecorator('jobName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务组名">
                {getFieldDecorator('jobGroup', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {taskName.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='调用方法'>
                {getFieldDecorator('invokeTarget', { initialValue: '', })(
                  <Input placeholder="请输入调用目标字符串" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='日志信息'>
                {getFieldDecorator('jobMessage', { initialValue: '', })(
                  <Input placeholder="请输入" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='异常信息'>
                {getFieldDecorator('exceptionInfo', { initialValue: '', })(
                  <Input placeholder="请输入" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="执行状态">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {statusmap.map(obj => (
                      <Option key={obj.key} value={obj.key}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right', paddingTop: 4, marginBottom: 24 }}>{extra}</Col>
          </Form>
        </Row>
        {/* <div style={{ marginBottom: 24 }}>
          <Button type="danger" ghost style={{ marginRight: 8 }}>删 除</Button>
          <Button type="danger" ghost style={{ marginRight: 8 }}>清 空</Button>
          <Button type="primary" style={{ marginRight: 8 }}>导 出</Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => window.history.back()}>关 闭</Button>
        </div> */}
        <Table
          columns={columns}
          loading={loading}
          dataSource={qrtzjobloglist.rows || []}
          rowKey={record => record.jobLogId}
          pagination={pagination}
          scroll={{ x: 1300 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ timedtaskmodel, loading }) => ({
    qrtzjobloglist: timedtaskmodel.qrtzjobloglist,
    loading: loading.models.timedtaskmodel,
  }))(SchedultaskLog),
);
