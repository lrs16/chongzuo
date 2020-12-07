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
  Table,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Option } = Select;
const { RangePicker } = DatePicker;

const faultSource = [ // 故障来源
  { key: 1, value: '用户电话申告' },
  { key: 2, value: '用户自助申告' },
  { key: 3, value: '巡检发现' },
  { key: 4, value: '系统监控发现' },
  { key: 5, value: '企信' },
  { key: 6, value: '值班' },
  { key: 7, value: '其它' },
  { key: 8, value: '春风行动' },
];

const faultworkStatus = [ // 工单状态
  { key: 1, value: '已处理待回顾' },
  { key: 2, value: '处理中'},
  { key: 3, value: '已关闭' },
  { key: 4, value: '已回顾' },
  { key: 5, value: '审核中' },
  { key: 6, value: '已登记' },
  { key: 7, value: '已派单审核' },
  { key: 8, value: '已审核待处理' },
];

const priority = [ // 优先级
  { key: 1, value: '低' },
  { key: 2, value: '中' },
  { key: 3, value: '高' },
  { key: 4, value: '紧急' },
];

@connect(({ fault, loading }) => ({  // 连接fault.js文件
  fault,
  loading: loading.models.fault,
}))

class QueryList extends Component {
  state = {
    expand: false,
    // current: 1,
    // pageSize: 1,
    // queKey: '',
  };

  componentDidMount() {
    this.getQueryList();      
  }

  getQueryList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'fault/fetchfaultSearchList',
    }); 
  }

  // changePage = page => {
  //   this.props.dispatch({
  //     type: 'fault/fetchfaultSearchList',
  //     payload: {
  //       queKey: this.state.quekey,
  //       page,
  //       limit: this.state.pageSize,
  //     },
  //   });
  //   setTimeout(() => {
  //     this.setState({ current: page });
  //   }, 0);
  // };

  // onShowSizeChange = (current, pageSize) => {
  //   console.log(this.state.current);
  //   this.props.dispatch({
  //     type: 'fault/fetchfaultSearchList',
  //     payload: {
  //       quekey: this.state.quekey,
  //       page: current,
  //       limit: pageSize,
  //     },
  //   });
  //   setTimeout(() => {
  //     this.setState({ pageSize });
  //   }, 0);
  // };

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

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 100,
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '故障编号',
        dataIndex: 'faultID',
        key: 'faultID',
        width: 150,
        render: (text) => {
          return (
            <Link
              to={{
                pathname: `/ITSM/faultmanage/faultmanagepro`,
              }}
            >
              {text}
            </Link>
          );
        },
      },
      {
        title: '故障标题',
        dataIndex: 'faultTitle',
        key: 'faultTitle',
        width: 200,
      },
      {
        title: '故障来源',
        dataIndex: 'faultSource',
        key: 'faultSource',
        width: 150,
      },
      {
        title: '故障分类',
        dataIndex: 'faultClass',
        key: 'faultClass',
        width: 150,
      },
      {
        title: '申报单位',
        dataIndex: 'applicant',
        key: 'applicant',
        width: 260,
      },
      {
        title: '申报人',
        dataIndex: 'declarant',
        key: 'declarant',
        width: 120,
      },
      {
        title: '工单状态',
        dataIndex: 'faultworkStatus',
        key: 'faultworkStatus',
        width: 120,
      },
      {
        title: '登记人',
        dataIndex: 'regist',
        key: 'regist',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'createtime',
        key: 'createtime',
        width: 200,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
      },
    ];

    const { getFieldDecorator } = this.props.form;

    const { fault: { faultquerydata } } = this.props;
    const dataSource = [...faultquerydata];
    // const pagination = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
    //   current: this.state.current,
    //   pageSize: this.state.pageSize,
    //   onChange: page => this.changePage(page),
    // };
    
    return (
      <PageHeaderWrapper title={this.props.route.name}>
        <Card>
          <Form
            style={{ display: 'block' }}
            id="showItem"
            onSubmit={this.handleSearch}
            {...formItemLayout}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="故障编号">
                  {getFieldDecorator('faultID', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障标题">
                  {getFieldDecorator('faultTitle', {
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
                <Form.Item label="故障编号">
                  {getFieldDecorator('faultID', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障标题">
                  {getFieldDecorator('faultTitle', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障来源">
                  {getFieldDecorator('faultSource', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {faultSource.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="工单状态">
                  {getFieldDecorator('faultworkStatus', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {faultworkStatus.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="创建日期">
                  {getFieldDecorator('createtime')(<RangePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="故障对象">
                  {getFieldDecorator('faultObj', {
                    // initialValue: '',
                  })(
                    <Select placeholder="请选择" />,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="故障分类">
                  {getFieldDecorator('faultClass', {
                    initialValue: '',
                  })(<Select />)}
                </Form.Item>
              </Col>
                
              <Col span={8}>
                <Form.Item label="优先级">
                  {getFieldDecorator('priority', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {priority.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="申报人单位">
                  {getFieldDecorator('declarantCompany', {
                    // initialValue: '',
                  })(
                    <Select />,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="申报人部门">
                  {getFieldDecorator('declarantDepart', {
                    // initialValue: '', 
                  })(
                    <Select />,
                  )}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="申报人">
                  {getFieldDecorator('declarant', {
                    // initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="申报人电话">
                  {getFieldDecorator('declarantPhone', {
                    // initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="登记人单位">
                  {getFieldDecorator('registCompany', {
                    initialValue: '',
                  })(<Select />,)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="登记人部门">
                  {getFieldDecorator('registDepart', {
                    initialValue: '',
                  })(<Select />,)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="登记人">
                  {getFieldDecorator('regist', {
                    initialValue: '',
                  })(<Input allowClear/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="处理人单位">
                  {getFieldDecorator('handlerCompany', {
                    initialValue: '',
                  })(<Select />,)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="处理人部门">
                  {getFieldDecorator('handlerDepart', {
                    initialValue: '',
                  })(<Select />,)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="处理人">
                  {getFieldDecorator('handler', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="回顾人单位">
                  {getFieldDecorator('retrosCompany', {
                    initialValue: '',
                  })(<Select />,)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="回顾人部门">
                  {getFieldDecorator('retrosDepart', {
                    initialValue: '',
                  })(<Select />,)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="回顾人">
                  {getFieldDecorator('retros', {
                    initialValue: '',
                  })(<Input />)}
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
            <Table
              columns={columns}
              dataSource={dataSource}
              // pagination={pagination}
              rowKey={record => record.faultID}
              table-layout="fixed"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(QueryList);
