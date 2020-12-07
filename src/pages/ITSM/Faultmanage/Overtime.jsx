import React, { Component } from 'react';
import {
  Card,
  Input,
  Form,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Icon,
  Table
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Option } = Select;
const { RangePicker } = DatePicker;

const timeoutInfo = [ // 超时信息
  { key: 1, value: '' },
  { key: 2, value: '待响应' },
  { key: 3, value: '处理中' },
  { key: 4, value: '待回访' },
];

class Overtime extends Component {
  state = {
    tabActiveKey: 'timeoutnotdeal',
    expand: false,
  };

  handleTabChange = (key) => {
    this.setState({
      tabActiveKey: key,
    });
  };

  handleSearch = e => {  // 查询
    e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //   console.log('Received values of form: ', values);
    // });
  };

  handleReset = () => { // 重置
    this.props.form.resetFields();
  };

  showItem = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
    document.getElementById('hideItem').style.display = 'block';
    document.getElementById('showItem').style.display = 'none';
  };

  hideItem = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
    document.getElementById('hideItem').style.display = 'none';
    document.getElementById('showItem').style.display = 'block';
  };

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 100,
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '工作单编号',
        dataIndex: 'workID',
        key: 'workID',
        width: 150,
      },
      {
        title: '申报人单位',
        dataIndex: 'declarantCompany',
        key: 'declarantCompany',
        width: 250,
      },
      {
        title: '工作单标题',
        dataIndex: 'workTitle',
        key: 'workTitle',
        width: 150,
      },
      {
        title: '工作单来源',
        dataIndex: 'workSource',
        key: 'workSource',
        width: 150,
      },
      {
        title: '工作单类型',
        dataIndex: 'workType',
        key: 'workType',
        width: 150,
      },
      {
        title: '工作单分类',
        dataIndex: 'workClass',
        key: 'workClass',
        width: 150,
      },
      {
        title: '申报人',
        dataIndex: 'declarant',
        key: 'declarant',
        width: 120,
      },
      {
        title: '处理人',
        dataIndex: 'handler',
        key: 'handler',
        width: 120,
      },
      {
        title: '当前处理环节',
        dataIndex: 'currProceLink',
        key: 'currProceLink',
        width: 200,
      },
      {
        title: '超时信息',
        dataIndex: 'timeoutInfo',
        key: 'timeoutInfo',
        width: 150,
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        key: 'sendTime',
        width: 200,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
      },
      {
        title: '发送人',
        dataIndex: 'sender',
        key: 'sender',
        width: 100,
      },
    ];
    
    const columns1 = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 100,
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '工单编号',
        dataIndex: 'workID',
        key: 'workID',
        width: 150,
      },
      {
        title: '工单标题',
        dataIndex: 'workTitle',
        key: 'workTitle',
        width: 150,
      },
      {
        title: '处理人',
        dataIndex: 'handler',
        key: 'handler',
        width: 120,
      },
      {
        title: '处理人单位',
        dataIndex: 'handlerCompany',
        key: 'handlerCompany',
        width: 150,
      },
      {
        title: '超时类型',
        dataIndex: 'timeoutType',
        key: 'timeoutType',
        width: 150,
      },
      {
        title: '超时原因',
        dataIndex: 'timeoutReason',
        key: 'timeoutReason',
        width: 150,
      },
      {
        title: '超时时长',
        dataIndex: 'timeoutDurate',
        key: 'timeoutDurate',
        width: 150,
      },
      {
        title: '事件送达时间',
        dataIndex: 'EventServicetime',
        key: 'EventServicetime',
        width: 150,
      },
      {
        title: '超时时间',
        dataIndex: 'overTime',
        key: 'overTime',
        width: 150,
      },
      {
        title: '建单时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        width: 150,
      },
      {
        title: '事件优先级',
        dataIndex: 'EventPriority',
        key: 'EventPriority',
        width: 150,
      },
      {
        title: '事件对象',
        dataIndex: 'EventObj',
        key: 'EventObj',
        width: 150,
      },
      {
        title: '事件分类',
        dataIndex: 'EventClass',
        key: 'EventClass',
        width: 150,
      },
    ]
    
    const columns2 = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 100,
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '工作单编号',
        dataIndex: 'workID',
        key: 'workID',
        width: 150,
      },
      {
        title: '申报人单位',
        dataIndex: 'declarantCompany',
        key: 'declarantCompany',
        width: 250,
      },
      {
        title: '工作单标题',
        dataIndex: 'workTitle',
        key: 'workTitle',
        width: 150,
      },
      {
        title: '工作单来源',
        dataIndex: 'workSource',
        key: 'workSource',
        width: 150,
      },
      {
        title: '工作单类型',
        dataIndex: 'workType',
        key: 'workType',
        width: 150,
      },
      {
        title: '工作单分类',
        dataIndex: 'workClass',
        key: 'workClass',
        width: 150,
      },
      {
        title: '申报人',
        dataIndex: 'declarant',
        key: 'declarant',
        width: 120,
      },
      {
        title: '当前处理环节',
        dataIndex: 'currProceLink',
        key: 'currProceLink',
        width: 200,
      },
      {
        title: '超时信息',
        dataIndex: 'timeoutInfo',
        key: 'timeoutInfo',
        width: 150,
      },
      {
        title: '超时时间',
        dataIndex: 'overTime',
        key: 'overTime',
        width: 150,
      },
      {
        title: '处理人',
        dataIndex: 'handler',
        key: 'handler',
        width: 120,
      },
      {
        title: '发送时间',
        dataIndex: 'sendTime',
        key: 'sendTime',
        width: 150,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
      },
    ];

    const tabList = [
      {
        key: 'timeoutnotdeal',
        tab: '已超时未处理',
      },
      {
        key: 'timeoutdeal',
        tab: '超时已处理',
      },
      {
        key: 'betimeout',
        tab: '即将超时',
      },
    ];

    const contentTabList = {
      'timeoutnotdeal': 
        <Table
          columns={columns}
          rowKey={record => record.workID}
        />,
      'timeoutdeal': 
        <Table
          columns={columns1}
          rowKey={record => record.workID}
        />,
      'betimeout': 
        <Table
          columns={columns2}
          rowKey={record => record.workID}
        />,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 4 },
        sm: { span: 17 },
      },
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderWrapper 
        title={this.props.route.name} 
        tabList={tabList} 
        onTabChange={this.handleTabChange} 
        tabActiveKey={this.state.tabActiveKey}
      >
        <Card>
          <Form
            style={{ display: 'block' }}
            id="showItem"
            onSubmit={this.handleSearch}
            {...formItemLayout}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="处理人">
                  {getFieldDecorator('handler', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="工单编号">
                  {getFieldDecorator('workID', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={7} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重 置</Button>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.showItem} >
                  展开 <Icon type={this.state.expand ? 'up' : 'down'} />
                </a>
              </Col>
            </Row>
          </Form>

          <Form
            id="hideItem"
            style={{ display: 'none' }}
            {...formItemLayout}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="处理人">
                  {getFieldDecorator('handler', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="工单编号">
                  {getFieldDecorator('workID', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="申报人单位">
                  {getFieldDecorator('declarantCompany', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="工作单标题">
                  {getFieldDecorator('workTitle', {
                    initialValue: '',
                  })(<Select />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="申报人">
                  {getFieldDecorator('declarant', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="超时信息">
                  {getFieldDecorator('timeoutInfo', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {timeoutInfo.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="建单时间">
                  {getFieldDecorator('creationTime')(<RangePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>

              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重 置
                </Button>
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.hideItem} >
                  收起 <Icon type={this.state.expand ? 'up' : 'down'} />
                </a>
              </Col>
            </Row>
          </Form>
          
          <div>
            <Button type="primary" style={{ marginBottom: 25 }}>导出数据</Button>
            {contentTabList[this.state.tabActiveKey]}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Overtime);

