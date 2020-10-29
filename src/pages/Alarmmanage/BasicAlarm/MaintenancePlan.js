import React, { Component } from 'react';

import { Card, Tabs, Table, Form, Input, Button, Tag, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import MaintenancePlanEdit from './components/MaintenancePlanEdit';
import HistoryDetail from './components/HistoryDetail';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { TabPane } = Tabs;
@connect(({ maintenanceplan, loading }) => ({
  maintenanceplan,
  loading: loading.models.maintenanceplan,
}))
class MaintenancePlan extends Component {
  state = {
    current: 1,
    pageSize: 1,
    queKey: '',
    selectedRows: [],
  };

  componentDidMount() {
    this.getlist();
  }

  getlist = () => {
    this.props.dispatch({
      type: 'maintenanceplan/mainplayList',
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'maintenanceplan/mainplayList',
      payload: {
        queKey: this.state.quekey,
        page,
        limit: this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };
  //改变每条展示的条数产生的回调
  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'maintenanceplan/mainplayList',
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

  maintenanceAdd = e => {
    console.log(this.state.selectedRows.length + 'pp');
    if (this.state.selectedRows.length == 0) {
      message.info('每次至少选择一条数据编辑');
      e.preventDefault();
    } else {
    }
  };

  handleDeleteOk = () => {
    if (this.state.selectedRows.length) {
      const idList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.id;
        idList.push(id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'maintenanceplan/mainplayList',
        payload: idList,
      }).then(() => {
        this.getlist();
      });
    } else {
      message.info('至少选择一条数据');
    }
  };

  showAdvancedquery = () => {
    document.getElementById('advancedquery').style.display = 'block';
    document.getElementById('simplequery').style.display = 'none';
  };

  hide = () => {
    document.getElementById('advancedquery').style.display = 'none';
    document.getElementById('simplequery').style.display = 'block';
  };

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRows: selectedRows,
        });
      },
    };

    const handleUpdate = () => {
      const { dispatch } = values => {
        return dispatch({
          type: 'maintenanceplan/mainplaySave',
          payload: values,
        }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            this.getlist();
          } else {
            Message.error(res.msg);
          }
        });
      };
    };

    const { getFieldDecorator } = this.props.form;
    const {
      maintenanceplan: { list },
    } = this.props;
    const dataSource = [...list];
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      onChange: page => this.changePage(page),
    };
    const columns = [
      {
        title: '计划名称',
        dataIndex: 'programName',
        key: 'programName',
        render: (text, record) => (
          <MaintenancePlanEdit record={record} onSumit={handleUpdate}>
            <span>{text}</span>
          </MaintenancePlanEdit>
        ),
      },
      {
        title: '维护设备',
        dataIndex: 'maintenanceEquipment',
        key: 'maintenanceEquipment',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'founder',
        key: 'founder',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
    ];
    return (
      <PageHeaderWrapper title="维护计划">
        <Card>
          <Form
            layout="inline"
            onSubmit={this.handleSearch}
            style={{ display: 'block' }}
            id="simplequery"
          >
            <Form.Item label="计划名称" style={{ marginLeft: 50 }}>
              {getFieldDecorator('planName', {
                rules: [{}],
                initialValue: '',
              })(<Input style={{ width: 300 }} />)}
            </Form.Item>

            <Form.Item label="设备名称" style={{ marginLeft: 50 }}>
              {getFieldDecorator('equipmentName', {
                rules: [{}],
                initialValue: '',
              })(<Input style={{ width: 300 }} />)}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 300 }}>
                查询
              </Button>
            </Form.Item>

            <Form.Item>
              <Button onClick={this.handleReset}>重置</Button>
            </Form.Item>

            <Form.Item>
              <p onClick={this.showAdvancedquery}>展开</p>
            </Form.Item>
          </Form>

          <Form
            style={{ display: 'none' }}
            id="advancedquery"
            layout="inline"
            onSubmit={this.handleSearch}
          >
            <Form.Item label="计划名称" style={{ marginLeft: 250 }}>
              {getFieldDecorator('planName', {
                initialValue: '',
              })(<Input style={{ width: 300 }} />)}
            </Form.Item>

            <Form.Item label="设备名称" style={{ marginLeft: 150 }}>
              {getFieldDecorator('equipmentName', {
                initialValue: '',
              })(<Input style={{ width: 300 }} />)}
            </Form.Item>
            <br></br>

            <Form.Item label="开始时间" style={{ marginLeft: 250 }}>
              {getFieldDecorator('startTime', {
                initialValue: '',
              })(<Input style={{ width: 300 }} />)}
            </Form.Item>

            <Form.Item label="结束时间" style={{ marginLeft: 150 }}>
              {getFieldDecorator('endTime', {
                initialValue: '',
              })(<Input style={{ width: 300 }} />)}
            </Form.Item>
            <br></br>

            <div style={{ float: 'right' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>

              <Form.Item>
                <Button>重置</Button>
              </Form.Item>

              <Form.Item onClick={this.hide}>收起</Form.Item>
            </div>
          </Form>
          {/* <p></p> */}

          <Form layout="inline" style={{ marginBottom: 20, marginTop: 40 }}>
            <Form.Item>
              <MaintenancePlanEdit onSumit={handleUpdate} record={this.state.selectedRows}>
                <Button type="primary">新建</Button>
              </MaintenancePlanEdit>
            </Form.Item>

            <Form.Item>
              {/* <MaintenancePlanEdit > */}
              {/* <Button type='primary'>编辑</Button> */}
              {/* </MaintenancePlanEdit> */}
            </Form.Item>

            <Form.Item>
              <Popconfirm title="确定删除吗？" onConfirm={this.handleDeleteOk}>
                <Button style={{ marginRight: 10 }}>删除</Button>
              </Popconfirm>
            </Form.Item>

            <Form.Item>
              <Tag
                color="gold"
                style={{ paddingLeft: 5, paddingBottom: 5, paddingRight: 5, paddingTop: 5 }}
              >
                !维护时间段内，维护设备将不会接收到告警。
              </Tag>
            </Form.Item>
          </Form>
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 2000 }}
            pagination={pagination}
            rowSelection={rowSelection}
            rowKey={record => record.id}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(MaintenancePlan);
