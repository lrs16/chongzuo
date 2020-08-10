import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Message,
  Divider,
  Badge,
  Popconfirm,
  Pagination,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HostEdit from './components/HostEdit';
import HostSoft from './components/Host_Soft';

const statusMap = ['default', 'success'];
const status = ['停用', '在用'];
const { Search } = Input;
@connect(({ automaticmodel, loading }) => ({
  automaticmodel,
  loading: loading.models.automaticmodel,
}))
class HostManage extends Component {
  state = {
    current: 1,
    pageSize: 10,
    queKey: '',
  };

  componentDidMount() {
    this.getlist();
  }

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    this.props.dispatch({
      type: 'automaticmodel/fetch',
      paload: {
        page,
        limit,
        queKey,
      },
    });
  };

  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.setState({
      queKey: values,
    });
    this.props.dispatch({
      type: 'automaticmodel/search',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'automaticmodel/search',
      payload: {
        queKey: this.state.queKey,
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
      type: 'automaticmodel/search',
      payload: {
        queKey: this.state.queKey,
        page: current,
        limit: pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  render() {
    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/update',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('添加主机失败');
        }
      });
    };

    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/edit',
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

    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/remove',
        payload: { id },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('删除主机失败！');
        }
      });
    };

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '主机名称',
        dataIndex: 'hostsName',
        key: 'hostsName',
      },
      {
        title: '更新时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'hostsStatus',
        key: 'hostsStatus',
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.hostsStatus]} text={status[record.hostsStatus]} />
          </span>
        ),
      },
      {
        title: 'IP地址',
        dataIndex: 'hostsIp',
        key: 'hostsIp',
      },
      {
        title: '主机排序',
        dataIndex: 'hostsSort',
        key: 'hostsSort',
      },
      {
        title: '主机分区',
        dataIndex: 'hostsZoneId',
        key: 'hostsZoneId',
      },
      {
        title: '主机操作系统',
        dataIndex: 'hostsOsId',
        key: 'hostsOsId',
      },
      {
        title: '机柜',
        dataIndex: 'hostsCabinetId',
        key: 'hostsCabinetId',
      },
      {
        title: '主机备注',
        dataIndex: 'hostsRemark',
        key: 'hostsRemark',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <HostSoft
              title="配置软件"
              // roleId={record.id
            >
              <a type="link">配置软件</a>
            </HostSoft>
            <Divider type="vertical" />
            <HostEdit
              onSumit={values => handleEdite(values)}
              title="编辑主机"
              record={record}
              refresh={this.getlist}
            >
              <a type="link">编辑</a>
            </HostEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const {
      automaticmodel: { data },
    } = this.props;
    const dataSource = data.rows;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: data.total,
      onChange: page => this.changePage(page),
    };

    return (
      <PageHeaderWrapper title="主机管理">
        <Card>
          <Form style={{ float: 'right', width: '30%' }}>
            <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
          </Form>
          <HostEdit onSumit={handleUpdate}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              添加主机
            </Button>
          </HostEdit>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={record => record.id}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(HostManage);
