import React, { Component } from 'react';
import {
  Card,
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Icon,
  Table,
  // Tooltip,
  Modal,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import HostTree from '@/components/HostTree';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;
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

const currLinks = [ // 当前环节
  { key: 1, value: '缺陷登记' },
  { key: 2, value: '缺陷审核' },
  { key: 3, value: '缺陷处理' },
  { key: 4, value: '缺陷关闭' },
];

const priority = [ // 优先级
  { key: 1, value: '低' },
  { key: 2, value: '中' },
  { key: 3, value: '高' },
  { key: 4, value: '紧急' },
];

// const treeDatas = [
//   {
//     "id": "1",
//     "parentId": "0",
//     "weight": 0,
//     "name": "主机信息",
//     "children": [
//         {
//             "id": "1318362398454063105",
//             "parentId": "1",
//             "weight": 1,
//             "name": "172.16.4.211"
//         },
//         {
//             "id": "1318482837854228481",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.210.13_测试服务器"
//         },
//         {
//             "id": "1320556274236002305",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.13_缓存服务器1"
//         },
//         {
//             "id": "1320565461959577601",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.14_缓存服务器2"
//         },
//         {
//             "id": "1320566329979179010",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.15_缓存服务器3"
//         },
//         {
//             "id": "1320566508165795842",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.20_缓存服务器4"
//         },
//         {
//             "id": "1320567195813548033",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.21_缓存服务器5"
//         },
//         {
//             "id": "1320567392681594882",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.22_缓存服务器6"
//         },
//         {
//             "id": "1320567525976576002",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.16_计算服务器1"
//         },
//         {
//             "id": "1320567748333408257",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.28_通信服务器2"
//         },
//         {
//             "id": "1320567897373806593",
//             "parentId": "1",
//             "weight": 1,
//             "name": "10.172.208.36_通信服务器3"
//         },
//         {
//             "id": "1320568056224681986",
//             "parentId": "1",
//             "weight": 3,
//             "name": "10.172.208.37_通信服务器4"
//         }
//     ]
//   }
// ];

@connect(({ fault, loading }) => ({  // 连接fault.js文件
  fault,
  loading: loading.models.fault,
}))

class ToDOlist extends Component {
  state = {
    // current: 1,
    // pageSize: 10,
    // queKey: '',
    expand: false,
    visible: false
  };

  componentDidMount() {
    this.getTodoList();
  }

  getTodoList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'fault/fetchfaultTodoList',
    });
  }

  // changePage = page => {
  //   this.props.dispatch({
  //     type: 'fault/fetchfaultTodoList',
  //     payload: {
  //       page,
  //       limit: this.state.pageSize,
  //       queKey: this.state.queKey,
  //     },
  //   });
  //   setTimeout(() => {
  //     this.setState({ current: page });
  //   }, 0);
  // };

  // onShowSizeChange = (current, pageSize) => {
  //   this.props.dispatch({
  //     type: 'fault/fetchfaultTodoList',
  //     payload: {
  //       queKey: this.state.queKey,
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

  downloadExcel = () => { // 导出
    // const { todolist } = this.props.fault; // 表格数据
    // // console.log(todolist);
    // const option = {};

    // option.fileName = 'excel';
    // option.datas = [
    //   {
    //     sheetData: todolist.map(item => {
    //       const result = {};
    //       todolist.forEach(c => {
    //         result[c.line] = item['line'];
    //         result[c.currProceLink] = item['currProceLink'];
    //         result[c.declarant] = item['declarant'];
    //         result[c.faultClafit] = item['faultClafit'];
    //         result[c.faultID] = item['faultID'];
    //         result[c.faultSource] = item['faultSource'];
    //         result[c.faultStatus] = item['faultStatus'];
    //         result[c.faultTitle] = item['faultTitle'];
    //         result[c.overTime] = item['overTime'];
    //         result[c.priority] = item['priority'];
    //         result[c.sendTime] = item['sendTime'];
    //       });
    //       // console.log(result);
    //       return result;
    //     }),
    //     sheetName: 'ExcelName',
    //     // sheetFilter:todolist.map(item => item.level),
    //     sheetHeader: [],
    //     columnWidths: todolist.map(item => 10),
    //   },
    // ];
    // const toExcel = new ExportJsonExcel(option);
    // toExcel.saveExcel();
  }

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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
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
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '故障编号',
        dataIndex: 'faultID',
        key: 'faultID',
        width: 150,
        render: (text, record) => {
          return (
            <Link
              to={{
                pathname: `/ITSM/faultmanage/faultmanagepro`,
                state: {
                  todolistdata: record,
                }
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
        width: 120,
      },
      {
        title: '故障分类',
        dataIndex: 'faultClass',
        key: 'faultClass',
        width: 120,
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
        width: 150,
      },
      {
        title: '故障状态',
        dataIndex: 'faultStatus',
        key: 'faultStatus',
        width: 120,
      },
      {
        title: '超时时间',
        dataIndex: 'overTime',
        key: 'overTime',
        width: 200,
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
    ];

    const peoselectcolumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 50,
        render:(text,record,index)=>`${index+1}`,
      },
      {
        title: '用户名称',
        dataIndex: 'username',
        key: 'username',
        width: 100,
      },
    ]

    const { getFieldDecorator } = this.props.form;

    const { fault: { todolist } } = this.props;
    const dataSource = [...todolist];

    // const pagination = {
    //   showSizeChanger: true,
    //   onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
    //   current: this.state.current,
    //   pageSize: this.state.pageSize,
    //   total: xxx.total,
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
                <Form.Item label="故障分类">
                  {getFieldDecorator('faultClass', {
                    initialValue: '',
                  })(<Select />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="当前环节">
                  {getFieldDecorator('currLinks', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {currLinks.map(({ key, value }) => [<Option key={key}>{value}</Option>])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="发送人">
                  {getFieldDecorator('sender', {
                    initialValue: '',
                  })(
                    <Input
                      suffix={
                        <div>
                          <Icon type="ellipsis" style={{ color: '#000000', cursor: 'pointer' }} onClick={this.showModal} />
                          <Modal
                            title="人员选择"
                            visible={this.state.visible}
                            centered
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            width = {1200}
                            footer={null}
                          >
                            <Row style={{ display: 'flex', background: '#f1f1f1' }}>
                              <Col span={5}>
                                <Search
                                  placeholder="input search text"
                                  // onSearch={value => console.log(value)}
                                  style={{width: '100%', marginBottom: 2}}
                                />
                                <Card>
                                  <HostTree />
                                </Card>
                              </Col>
                              <Col span={19}>
                                {/* <Card style={{ marginLeft: 8 }} bordered={false}> */}
                                    <Search
                                      placeholder="input search text"
                                      // onSearch={value => console.log(value)}
                                      style={{width: '25%', marginBottom: 2}}
                                    />
                                    <Table
                                      table-layout="fixed"
                                      columns={peoselectcolumns}
                                      
                                    />
                                {/* </Card> */}
                              </Col>
                            </Row>
                          </Modal>
                        </div>
                      }
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="发送时间">
                  {getFieldDecorator('sendTime')(<RangePicker style={{ width: '100%' }} />)}
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
            <Button type="primary" style={{ marginBottom: 25 }} onClick={this.downloadExcel}>导出数据</Button>
            <Table
              columns={columns}
              dataSource={dataSource}
              // pagination={pagination}
              rowKey={record => record.faultID}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ToDOlist);