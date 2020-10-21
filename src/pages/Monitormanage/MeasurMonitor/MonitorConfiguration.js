import react, { Component } from 'react';
import { connect } from 'dva';
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



const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} type='number'/>)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
@connect(({ monitorconfiguration, loading }) => ({
  monitorconfiguration,
  loading: loading.models.monitorconfiguration,
}))
class MonitorConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
   
      },
      {
        title: '指标ID',
        dataIndex: 'IndicatorID',
        key: 'IndicatorID',
      },
      {
        title: '指标名称',
        dataIndex: 'indicatorName',
        key: 'indicatorName',
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
        // width: 10,
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
      },
      {
        title: '设置时间',
        dataIndex: 'setTime',
        key: 'setTime',
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
    ];

    this.state = {
      dataSource: [
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
      ],
      // current: 1,
      // pageSize: 10,
      // quekey: '',
      selectedRows: [],
      idlist: '',
      count: 2,
    };
  }

  state = {
    current: 1,
    pageSize: 10,
    quekey: '',
    selectedRows: [],
    idlist: '',
  };




  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    const { dispatch } = this.props;
   dispatch({
      type:'monitorconfiguration/fetch',
      payload: {row}
    })
    this.setState({ dataSource: newData });
    // then(res => {
    //   if(res.code === 200){
    //     message.success(res.msg);
    //     this.setState({ dataSource: newData });
    //   }else {
    //     message.error(res.msg);
    //   }
    // });
  
  };

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

  pagination = {
    showSizeChanger: true,
    onshowSizeChange: (current, pageSize) => this.onshowSizeChange(current, pageSize),
    current: this.state.current,
    pageSize: this.state.pageSize,
    total:85,
    // showTotal: (total, current) => `共 ${total} 条记录 第 ${this.state.current} 页 `,
    onChange: page => this.changePage(page),
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
    console.log(this.state.current,'this.state.current');
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
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
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows, 'selectedRows');
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
            <Form {...formItemLayout}>
              <Col xl={8} xs={12}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('IndicatoName', {})(<Input />)}
                </Form.Item>
              </Col>

              <Col xl={8} xs={12}>
                <Form.Item label="设置时间">
                  {getFieldDecorator('setTime', {})(<DatePicker />)}
                </Form.Item>
              </Col>

              <Col xl={4} xs={12} style={{ textAlign: 'right' }}>
                <Button style={{ marginRight: 12 }} type="primary">
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
            <Form {...formItemLayout}>
              <Col xl={8} xs={12}>
                <Form.Item label="指标名称">
                  {getFieldDecorator('IndicatoName', {})(<Input placeholder="输入名称/IP" />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="设置时间">
                  {getFieldDecorator('monitorType', {})(<DatePicker />)}
                </Form.Item>
              </Col>
              <Col xl={8} xs={12}>
                <Form.Item label="备注">
                  {getFieldDecorator('remark', {})(<Input placeholder="请输入" />)}
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
                <Button style={{ marginRight: 12 }} type="primary">
                  查询
                </Button>
                <Button>重置</Button>
              </Col>

              <Col xl={2} xs={12}>
                <p onClick={this.hide}>收起</p>
              </Col>
            </Form>
          </Row>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataSource}
            pagination={this.pagination}
            // rowkey={record => record.id}
          ></Table>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MonitorConfiguration);
