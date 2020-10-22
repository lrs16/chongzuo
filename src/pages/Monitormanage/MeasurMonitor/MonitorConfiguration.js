import react, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Layout,
  Card,
  Table,
  Form,
  Input,
  Button,
  Row,
  Col,
  Radio,
  message,
  DatePicker,
  InputNumber,
  Popconfirm,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Link from 'umi/link';
const { Header, Footer, Sider, Content } = Layout;
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

const statusMap = ['#D3D3D3', '#1E90FF'];
const status = ['已停用', '已启用'];
const colSql = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'inline-block',
  color: 'red',
};
let idstr = '';
const data = [];
const arr = [
  {
    id: 1,
    serialNumber: 1,
    IndicatorID: 'zb202005130001',
    indicatorName: '采集完整率1',
    maximumValue: 60,
    minimum: 10,
    remark: '采集完整率的备注备注备注1',
    setPerson: '朱三三',
    setTime: '2020-05-11  09:46',
    enableStatus: '0',
  },
  {
    id: 2,
    serialNumber: 2,
    IndicatorID: 'zb202005130001',
    indicatorName: '采集完整率2',
    maximumValue: 60,
    minimum: 10,
    remark: '采集完整率的备注备注备注2',
    setPerson: '朱三三',
    setTime: '2020-05-11  09:46',
    enableStatus: '1',
  },
  {
    id: 3,
    serialNumber: 3,
    IndicatorID: 'zb202005130001',
    indicatorName: '采集完整率3',
    maximumValue: 60,
    minimum: 10,
    remark: '采集完整率的备注备注备注',
    setPerson: '朱三三',
    setTime: '2020-05-11  09:46',
    enableStatus: '1',
  },
];
for (let i = 0; i < arr.length; i++) {
  data.push({
    key: arr[i].id,
    serialNumber: (arr[i]).serialNumber,
    IndicatorID: (arr[i]).IndicatorID,
    indicatorName: (arr[i]).indicatorName,
    maximumValue: (arr[i]).maximumValue,
    minimum: (arr[i]).minimum,
    remark: (arr[i]).remark,
    setPerson: (arr[i]).setPerson,
    setTime: (arr[i]).setTime,
    enableStatus: (arr[i]).enableStatus,
  });
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}
let dateFormat; 
@connect(({ monitorconfiguration, loading }) => ({
  monitorconfiguration,
  loading: loading.models.monitorconfiguration,
}))

class MonitorConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: '序号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        editable: true,
      },
      {
        title: '指标ID',
        dataIndex: 'IndicatorID',
        key: 'IndicatorID',
        editable: true,
      },
      {
        title: '指标名称',
        dataIndex: 'indicatorName',
        key: 'indicatorName',
        editable: true,
        render: text => <span style={{ color: '#1E90FF' }}>{text}</span>,
      },
      {
        title: '最高值',
        dataIndex: 'maximumValue',
        key: 'maximumValue',
        editable: true,
      },
      {
        title: '最低值',
        dataIndex: 'minimum',
        key: 'minimum',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        editable: true,
        render: text => (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              color: 'red',
              width: '150px',
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: '设置人',
        dataIndex: 'setPerson',
        key: 'setPerson',
        editable: true,
      },
      {
        title: '设置时间',
        dataIndex: 'setTime',
        key: 'setTime',
        editable: true,
      },
      {
        title: '启用状态',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        render: (text, record) => (
          <span style={{ color: statusMap[record.enableStatus], textDecoration: 'underline' }}>
            {status[record.enableStatus]}
          </span>
        ),
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
          );
        },
      },
    ];
    // dateFormat:''
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  bataddSave = (value) => {
    console.log(value,'value');
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const { dispatch } = this.props;
        // return dispatch ({
        //   type:'monitorconfiguration/fetch',
        //   payload: {row}
        // }).then(res => {
        //   // if(res.code === 200){
        //   //   const item = newData[index];
        //     newData.splice(index, 1, {
        //       ...item,
        //       ...row,
        //     });
        //     this.setState({ data: newData, editingKey: '' });
        //   // }else {
        //   //   message.info(res.msg);
        //   // }
        // });
        const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }
  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { quekey } = this.state;
    this.props.dispatch({
      type: 'monitorconfiguration/fetch',
      payload: {
        page,
        limit,
        quekey,
      },
    });
  };

  show = () => {
    document.getElementById('generalQuery').style.display = 'none';
    document.getElementById('advancedQuery').style.display = 'block';
  };

  hide = () => {
    document.getElementById('generalQuery').style.display = 'block';
    document.getElementById('advancedQuery').style.display = 'none';
  };

  monitorAdd = e => {
    if (this.state.selectedRows.length) {
      message.info('新建不能选中数据');
      e.preventDefault();
    }
  };

  monitorBatchadd = e => {
    if (this.state.selectedRows.length == 0) {
      message.info('批量编辑数据必须选择一条以上的数据');
      e.preventDefault();
    }
  };

  monitorDelete = e => {
    const idlist = [];
    if (this.state.selectedRows.length == 0) {
      message.info('必须选中一条数据');
      e.preventDefault();
    } else {
      this.state.selectedRows.forEach(function(items, index, arrData) {
        idlist.push(items.id);
      });
    }
    const { dispatch } = this.props;
    return dispatch({
      type: 'monitorconfiguration/fetch',
      payload: { idlist },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        this.getList();
      } else {
        message.error(res.msg);
      }
    });
  };

  onshowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'monitorconfiguration/fetch',
      payload: {
        quekey: this.state.quekey,
        page: current,
        limit: pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  changePage = page => {
    this.props.dispatch({
      type: 'monitorconfiguration/fetch',
      payload: {
        quekey: this.state.quekey,
        page,
        limit: this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err,value) => {
      if(err) {
        return;
      }
      value.setTime = this.dateFormat;
    })
  }

  onChange = (date, dateString) => {
    this.dateFormat = dateString;
    
  }

  render() {
    const pagination = {
      showSizeChanger: true,
      onshowSizeChange: (current, pageSize) => this.onshowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total:85,
      showTotal: (total, current) => `共 ${total} 条记录 第 ${this.state.current} 页 `,
      onChange: page => this.changePage(page),
};
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'maximumValue' ? 'number' : col.dataIndex === 'minimum' ?'number':'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        selectedRows.forEach(function(item) {
          idstr = item.id;
        });
        this.setState({
          selectedRows: selectedRows,
          idlist: idstr,
        });
      },
    };

    const { getFieldDecorator } = this.props.form;

    
    return (
      <PageHeaderWrapper title="计量业务监控配置">
        <Card>
          <Row gutter={24} id="generalQuery">
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Col xl={8} xs={12}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('IndicatoName', {})(<Input />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="设置时间">
                  {getFieldDecorator('setTime', {
                  })(<DatePicker  onChange={this.onChange}/>)}
                </Form.Item>
              </Col>

              <Col xl={4} xs={12} style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 12 }} type="primary" htmlType='submit'>
                  查询
                </Button>
                <Button>重置</Button>
              </Col>

              <Col xl={4} xs={12}>
                <p onClick={this.show}>展开</p>
              </Col>
            </Form>
          </Row>
          <Row gutter={24} style={{ display: 'none' }} id="advancedQuery">
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Col xl={8} xs={12}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('IndicatoName', {})(<Input placeholder="输入名称/IP" />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="设置时间">
                  {getFieldDecorator('monitorType', {})(<DatePicker onChange={this.onChange}/>)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="备注">
                  {getFieldDecorator('remark', {
                    initialValue:''
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="设置人">{getFieldDecorator('setMan', {})(<Input />)}</Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="警戒值">
                  {getFieldDecorator('warnValue', {})(<Input />)}
                </Form.Item>
              </Col>
              <Col xl={4} xs={12}>
                <Button style={{ marginRight: 12 }} type="primary" htmlType='submit'>
                  查询
                </Button>
                <Button>重置</Button>
              </Col>

              <Col xl={2} xs={12}>
                <p onClick={this.hide}>收起</p>
              </Col>
            </Form>
          </Row>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',marginBottom:'20px' }}>
            <div>
              <Button type="primary" style={{ marginRight: '10px' }}>
                <Link to={`/monitormanage/measurmonitor/monitoraddedit`} onClick={this.monitorAdd}>
                  新增
                </Link>
              </Button>

              <Button type="primary" style={{ marginRight: '10px' }}>
                编辑
              </Button>
              <Button type="primary" style={{ marginRight: '10px' }}>
                <Link
                  to={{
                    pathname: '/monitormanage/measurmonitor/monitoraddedit',
                    state: {
                      data: this.state.selectedRows,
                      bataddSave:'ff'
                    },
                  }}
                  onClick={this.monitorBatchadd}
                >
                  批量编辑
                </Link>
              </Button>
              <Button
                type="danger"
                ghost
                style={{ marginRight: '10px' }}
                onClick={this.monitorDelete}
              >
                删除
              </Button>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={this.monitorDelete}>
                启用
              </Button>
              <Button onClick={this.monitorDelete}>停用</Button>
            </div>

            <div>
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">全部</Radio.Button>
                <Radio.Button value="b">已启用</Radio.Button>
                <Radio.Button value="c">停用</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <EditableContext.Provider value={this.props.form}>
            <Table
              rowSelection={rowSelection}
              components={components}
              bordered
              dataSource={this.state.data}
              columns={columns}
              rowClassName="editable-row"
              pagination={ pagination }
            />
        </EditableContext.Provider>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const EditableFormTable = Form.create()(MonitorConfiguration);

export default Form.create()(MonitorConfiguration);
