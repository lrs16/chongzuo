import React, { Component } from 'react';
import { Card, Table, Button, Form, Input, Select, Tag, message, Popconfirm, Message,Row,Col } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const color = ['#f50', '#f47920', '#dea32c', '#00ae9d', '#45b97c', '#70a19f'];
const statusMap = ['#D3D3D3', '#00ae9d'];
const status = ['已停用', '已启用'];
const { Option } = Select;

@connect(({ alarmstrategy, loading }) => ({
  alarmstrategy,
  loading: loading.models.alarmstrategy,
}))
class AlarmStrategy extends Component {
  state = {
    current: 1,
    pageSize: 3,
    quekey: '',
    selectedRows: [],
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    this.props.dispatch({
      type: 'alarmstrategy/strategyList',
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  changePage = page => {
    this.props.dispatch({
      type: 'alarmstrategy/strategyList',
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

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'alarmstrategy/strategyList',
      quekey: this.state.quekey,
      page,
      limit: this.state.pageSize,
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };
  //批量删除
  handleDeleteOk = () => {
    // confirm({
    // title:'确定要删除吗',
    // onOk() {
    if (this.state.selectedRows.length) {
      const idList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.detailsid;
        idList.push(id);
      });
      console.log(idList);
      const { dispatch } = this.props;
      dispatch({
        type: 'alarmstrategy/strategyList',
        payload: idList,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getList();
        } else {
          Message.error('删除告警失败');
        }
      });
    } else {
      message.info('至少选择一条数据');
    }
  };

  //编辑

  // strategyEdit = (e) => {
  //   if(this.state.detailsid.length>1){
  //     alert('每次只能选择一条数据编辑');

  // }
  // }

  gotoPage = e => {
    if (this.state.selectedRows.length == 0) {
      message.info('每次至少选择一条数据编辑');
      e.preventDefault();
    }
    if (this.state.selectedRows.length > 1) {
      message.info('每次只能选择一条数据编辑');
      e.preventDefault();
    }
  };

  strategyAdd = e => {
    if (this.state.selectedRows.length > 0) {
      message.info('添加用户不能选中数据');
      e.preventDefault();
    }
  };

  handleEnable = () => {
    if (this.state.selectedRows.length) {
      const enableList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.detailsid;
        enableList.push(id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'alarmstrategy/strategyEnable',
        payload: enableList,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getList();
        } else {
          Message.error('启用警告失败');
        }
      });
    } else {
      message.info('至少选择一条数据');
    }
  };

  handleOut = () => {
    if (this.state.selectedRows.length) {
      const outList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.detailsid;
        outList.push(id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'alarmstrategy/strategyOut',
        payload: outList,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getList();
        } else {
          Message.error('停用告警失败');
        }
      });
    } else {
      message.info('至少选择一条数据');
    }
  };

  render() {
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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRows: selectedRows,
        });
      },
    };

    const columns = [
      {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
        render: (text, record) => <Tag color={color[record.level]} style={{ padding: 10 }}></Tag>,
      },
      {
        title: '告警标题',
        dataIndex: 'alarmTitle',
        key: 'alarmTitle',
        render: (text, record) => (
          <span>
            <Link to={`alarmstrategy/strategydetail/:detailsid`}>
              {text}
            </Link>
          </span>
        ),
      },
      {
        title: '指标名称',
        dataIndex: 'indicatorName',
        key: 'indicatorName',
      },
      {
        title: '触发条件',
        dataIndex: 'triggerConditions',
        key: 'triggerConditions',
      },
      {
        title: '创建人',
        dataIndex: 'founder',
        key: 'founder',
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => (
          <span style={{ color: statusMap[record.state], textDecoration: 'underline' }}>
            {status[record.state]},
          </span>
        ),
      },
    ];

    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      onChange: page => this.changePage(page),
    };

    const {
      alarmstrategy: { list },
    } = this.props;
    const dataSource = [...list];
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper title="告警策略">
        <Card>
          <Form onSubmit={this.handleSubmit} {...formItemLayout}>
            <Row>
              <Col span={8}>
            <Form.Item label="监控分类:">
              {getFieldDecorator('monitorClassification', {
                rules: [{}],
                initialValue: '',
              })(<Select />)}
            </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item label="告警名称:">
              {getFieldDecorator('alarmName', {
                rules: [{}],
                initialValue: '',
              })(<Input />)}
            </Form.Item>
            </Col>
            <Col span={8} style={{textAlign:'right'}}>
              <Button htmlType="submit" type="primary">
                查询
              </Button>
              <Button onClick={this.handleReset}>重置</Button>
</Col>
            </Row>
          </Form>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
              marginBottom: 20,
            }}
          >
            <div>
              <Button style={{ marginRight: 10 }}>
                <Link to={`alarmstrategy/strategyadd`} onClick={this.strategyAdd}>
                  新增
                </Link>
              </Button>
              <Button type="primary" style={{ marginRight: 10 }} onClick={this.strategyEdit}>
                <Link
                  to={`alarmstrategy/strategyedit/${
                    this.state.selectedRows.length ? this.state.selectedRows[0].detailsid : ''
                  }`}
                  onClick={this.gotoPage}
                >
                  编辑
                </Link>
              </Button>
              <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleEnable}>
                启用
              </Button>
              <Button style={{ marginRight: 10 }} onClick={this.handleOut}>
                停用
              </Button>
              <Popconfirm title="确定删除吗？" onConfirm={this.handleDeleteOk}>
                <Button style={{ marginRight: 10 }}>删除</Button>
              </Popconfirm>

              {/* <Select style={{ width: 200 }} defaultValue="更多操作" style={{ color: '#0099FF' }}>
                {/* <Option value=''>更多操作</Option> */}
                {/* <Option value="copy">复制</Option>
                <Option value="modify">批量修改</Option>
              </Select>  */}
            </div>

            {/* <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Tag color="#f50" style={{ padding: 10 }}></Tag>
              <span>紧急</span>
              <Tag color="#f47920" style={{ padding: 10, marginLeft: 5 }}></Tag>
              <span>一般</span>
              <Tag color="#dea32c" style={{ padding: 10, marginLeft: 5 }}></Tag>
              <span>警告</span>
              <Tag color="#00ae9d" style={{ padding: 10, marginLeft: 5 }}></Tag>
              <span>恢复</span>
              <Tag color="#45b97c" style={{ padding: 10, marginLeft: 5 }}></Tag>
              <span>正常</span>
              <Tag color="#70a19f" style={{ padding: 10, marginLeft: 5 }}></Tag>
              <span>未知</span>
            </div> */}
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowSelection={rowSelection}
            pagination={pagination}
            rowKey={record => record.id}
          ></Table>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(AlarmStrategy);
