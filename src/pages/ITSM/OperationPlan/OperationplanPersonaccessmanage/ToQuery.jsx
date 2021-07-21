import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  DatePicker,
  Card,
  Table
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';

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

const { Option } = Select;
const { RangePicker } = DatePicker;

function ToQuery(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
  } = props;

  const [expand, setExpand] = useState(false);

  const columns = [
    {
      title: '进出申请编号',
      dataIndex: 'accessno',
      key: 'accessno',
      width: 180,
      fixed: 'left',
      render: (text, record) => {
        return <a>{text}</a>
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,

    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: 150,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '进出事由',
      dataIndex: 'jcsy',
      key: 'jcsy',
      width: 150,
    },
    {
      title: '计划进入时间',
      dataIndex: 'planStartTime',
      key: 'planStartTime',
      width: 150,
    },
    {
      title: '计划离开时间',
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      width: 150,
    },
    {
      title: '携带工具',
      dataIndex: 'xdgj',
      key: 'xdgj',
      width: 150,
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      width: 400,
    },
    {
      title: '申请人',
      dataIndex: 'sqr',
      key: 'sqr',
      width: 150,
    },
    {
      title: '审核结果',
      dataIndex: 'checkResult',
      key: 'checkResult',
      width: 150,
    },
    {
      title: '审核说明',
      dataIndex: 'checkContent',
      key: 'checkContent',
      width: 150,
    },
    {
      title: '审核人',
      dataIndex: 'checker',
      key: 'checker',
      width: 150,
    },
    {
      title: '审核单位',
      dataIndex: 'checkDept',
      key: 'checkDept',
      width: 150,
    },
  ];

  const handleSearch = () => {

  };

  // 重置
  const handleReset = () => {
    resetFields();
  };

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
    </Button></>)

  return (
    <PageHeaderWrapper title={pagetitle}>
      {/* <SysDict
        typeid="1354273739344187393"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      /> */}
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <>
              <Col span={8}>
                <Form.Item label="进出申请编号">
                  {getFieldDecorator('accessno', {
                    // initialValue: a.accessno,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核状态">
                  {getFieldDecorator('checkStatus', {
                    // initialValue: a.checkStatus,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {/* {checkstatusmap.map(obj => (
                        <Option key={obj.key}>
                          {obj.title}
                        </Option>
                      ))} */}
                      <Option value='1'>
                        1
                      </Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', {
                    // initialValue: a.name,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="性别">
                  {getFieldDecorator('sex', {
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phone', {
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="进出事由">
                  {getFieldDecorator('jcsy', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计划进入时间">
                  {getFieldDecorator('planStartTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计划离开时间">
                  {getFieldDecorator('planEndTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="携带根据">
                  {getFieldDecorator('xdgj', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请人">
                  {getFieldDecorator('sqr', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请时间">
                  {getFieldDecorator('applyTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核结果">
                  {getFieldDecorator('checkResult', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" allowClear>
                      <Option value='1'>
                        qq
                      </Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核时间">
                  {getFieldDecorator('checkTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核说明">
                  {getFieldDecorator('checkContent', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人">
                  {getFieldDecorator('checker', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="审核单位">
                  {getFieldDecorator('checkDept', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
            </span>
            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" style={{ marginRight: 8 }}>
            导出数据
          </Button>
        </div>
        <Table
          // loading={loading}
          columns={columns}
          // dataSource={list.rows}
          scroll={{ x: 1600 }}
          rowKey={r => r.id}
          // rowKey={(_, index) => index.toString()}
          // pagination={pagination}
          // rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(ToQuery);
