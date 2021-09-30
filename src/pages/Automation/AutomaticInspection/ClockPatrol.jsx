import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Badge, Button, Table, Form, Input, message, Row, Col, DatePicker, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PatrolconfigModal from './components/PatrolconfigModal';
import { createclockInspectionall } from './services/api';

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

const colormap = new Map([
  ['失败', 'error'],
  ['成功', 'success'],
  ['巡检中', 'blue'],
]);

const typemap = [{
  key: '0',
  title: '巡检全部'
}, {
  key: '1',
  title: '巡检配置'
}];

function ClockPatrol(props) {
  const pagetitle = props.route.name;
  const {
    loading,
    dispatch,
    clocklist,
    location,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    },
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.time1 = values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '';
    values.time2 = values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '';
    dispatch({
      type: 'automation/fetchclockList',
      payload: {
        ...values,
        pageIndex: page,
        pageSize: size,
      },
    });
  };

  useEffect(() => {
    searchdata(1, 15);
  }, [location]);


  const onShowSizeChange = (page, size) => {
    searchdata(page, size);
    setPageinations({
      ...paginations,
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
    total: clocklist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  const newDetailView = (Id) => { // 查看报告
    router.push({
      pathname: '/automation/automaticinspection/clockpatrol/clockview',
      query: {
        Id,
        addtab: true,
        menuDesc: '查看报告',
      },
    })
  };

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  );

  const columns = [
    {
      title: '巡检编号',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '巡检人',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '巡检状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span>
          <Badge status={colormap.get(record.status)} text={text} />
        </span>
      ),
    },
    {
      title: '巡检类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        return (
          <span>
              <a type="link"
                onClick={() => newDetailView(record.id)}
              >查看报告</a>
          </span>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={6}>
              <Form.Item label="巡检人">
                {getFieldDecorator('checkUser', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="巡检类型">
                {getFieldDecorator('type', {
                  initialValue: '',
                })(<Select placeholder="请选择" allowClear>
                  {typemap.map(obj => (
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="开始时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('startTime', {})(
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
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                  <Col span={11}>
                    {getFieldDecorator('endTime', {})(
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
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={4} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 8 }}>
          <Button type="primary" style={{ marginRight: 8 }}
            onClick={() => createclockInspectionall().then(res => {
              if (res.code === 200) {
                message.success(res.msg);
              } else {
                message.error(res.msg);
              }
            })}
          >巡检全部</Button>
          <PatrolconfigModal
            onChangeList={() => searchdata(1, 15)}
            pagename='clockpatrol'
          >
            <Button type="primary" style={{ marginRight: 8 }}
            >巡检配置</Button>
          </PatrolconfigModal>
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          columns={columns}
          dataSource={clocklist.rows}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ automation, loading }) => ({
    clocklist: automation.clocklist,
    loading: loading.models.automation,
  }))(ClockPatrol),
);
