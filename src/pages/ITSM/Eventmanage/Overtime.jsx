import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, DatePicker, Button, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

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

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

const tabList = [
  {
    key: 'remind',
    tab: '即将超时',
  },
  {
    key: 'notHandle',
    tab: '已超时未处理',
  },
  {
    key: 'timeout',
    tab: '超时已处理',
  },
];

const columns = [
  {
    title: '事件编号',
    dataIndex: 'eventNo',
    key: 'eventNo',
  },
  {
    title: '申报人',
    dataIndex: 'applicationUser',
    key: 'applicationUser',
  },
  {
    title: '事件标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '当前环节',
    dataIndex: 'flowNodeName',
    key: 'flowNodeName',
  },
  {
    title: '当前处理人',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '剩余时间',
    dataIndex: 'time',
    key: 'time',
  },
];

function Overtime(props) {
  const pagetitle = props.route.name;
  const { getFieldDecorator, resetFields } = props.form;
  const [tabActivekey, settabActivekey] = useState('remind'); // 打开标签
  const [expand, setExpand] = useState(false);

  const handleTabChange = key => {
    switch (key) {
      case 'remind':
        settabActivekey('remind');
        break;
      case 'notHandle':
        settabActivekey('notHandle');
        break;
      case 'timeout':
        settabActivekey('timeout');
        break;
      default:
        break;
    }
  };
  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="事件编号">
                {getFieldDecorator('eventNo', {
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前环节">
                {getFieldDecorator('flowNodeName', {
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('eventTitle', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="当前处理人">
                    {getFieldDecorator('userName', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="建单时间" {...forminladeLayout}>
                    {getFieldDecorator('createTime')(<RangePicker showTime />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Form.Item>
                  <Button type="primary">查 询</Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => resetFields()}>
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
                </Form.Item>
              </Col>
            )}
            {expand === true && (
              <Col span={24} style={{ textAlign: 'right', marginBottom: 8 }}>
                <Button type="primary">查 询</Button>
                <Button style={{ marginLeft: 8 }} onClick={() => resetFields()}>
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
            导出数据
          </Button>
        </div>
        <Table columns={columns} />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(Overtime);
