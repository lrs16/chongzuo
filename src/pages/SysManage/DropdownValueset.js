import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Table,
  Message,
  Divider,
  Popconfirm,
} from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import DropdownValueAdd from './components/DropdownValueAdd';
import DropdownValueEdit from './components/DropdownValueEdit';

const { Search } = Input;
@connect(({ umpsdropdown, loading }) => ({
  umpsdropdown,
  loading: loading.models.umpsdropdown,
}))

class DropdownValueset extends Component {
  state = {
    current: 1,
    pageSize: 10,
    queKey: '',
    bodyParams: {
      dictCode: '',
      dictModule: '',
      dictName: '',
      dictRemarks: '',
      dictState: '',
      dictType: '',
      isModify: '',
    }
  };

  componentDidMount() {
    this.getlist();
  }

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { bodyParams } = this.state;
    this.props.dispatch({
      type: 'umpsdropdown/getSearchDropdownValueList',
      payload: {
        page,
        limit,
        bodyParams
      },
    })
  };

  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.setState({
      queKey: values,
    });
    this.props.dispatch({
      type: 'umpsdropdown/search',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };
  

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'umpsdropdown/search',
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

  changePage = page => {
    this.props.dispatch({
      type: 'umpsdropdown/search',
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

  handleDelete = (id) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'umpsdropdown/remove',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
      } else {
        Message.error(res.msg);
      }
    });
  };

  handleEdite = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'umpsdropdown/edite',
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

  handleAdd = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'umpsdropdown/fetchAdd',
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

  render() {
    const {
      umpsdropdown: { list },
    } = this.props;
    const dataSource = list.rows;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      // total: list.total,
      onChange: page => this.changePage(page),
    };

    const columns = [
      {
        title: '数据编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '字典模块',
        dataIndex: 'dictModule',
        key: 'dictModule',
      },
      {
        title: '字典类型',
        dataIndex: 'dictType',
        key: 'dictType',
      },
      {
        title: '字典代码',
        dataIndex: 'dictCode',
        key: 'dictCode',
      },
      {
        title: '字典名称',
        dataIndex: 'dictName',
        key: 'dictName',
      },
      {
        title: '字典状态',
        dataIndex: 'dictStateExt',
        key: 'dictStateExt',
        // render: (text, record) => (
        //   <span>
        //     {dictStateExt[record.dictStateExt]},
        //   </span>
        // ),
      },
      {
        title: '是否能修改',
        dataIndex: 'isModifyExt',
        key: 'isModifyExt',
        // render: (text, record) => (
        //   <span>
        //     {isModifyExt[record.isModifyExt]},
        //   </span>
        // ),
      },
      {
        title: '字典排序',
        dataIndex: 'dictSort',
        key: 'dictSort',
      },
      {
        title: '字典备注',
        dataIndex: 'dictRemarks',
        key: 'dictRemarks',
      },
      // {
      //   title: 'tenantId',
      //   dataIndex: 'tenantId',
      //   key: 'tenantId',
      // },
      // createUser
      {
        title: '创建人',
        dataIndex: 'createUserNameExt',
        key: 'createUserNameExt',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <DropdownValueEdit
              record={record}
              onSumit={(values) => this.handleEdite(values, record)}
            >
              <a type="link">编辑</a>
            </DropdownValueEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此菜单吗？" onConfirm={() => this.handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="数据字典">
        <Card>
          <Form style={{ float: 'right', width: '30%' }}>
            <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
          </Form>
          <DropdownValueAdd onSumit={this.handleAdd}>
            <Button style={{ width: '100%', marginTop: 16, marginBottom: 8 }} type="dashed" icon="plus">
              新建字典
        </Button>
          </DropdownValueAdd>

          <Table
            columns={columns.filter(item => item.title !== '数据编号' || item.key !== 'id')}
            dataSource={dataSource}
            rowKey={record => record.id}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>


    );
  }
}

export default DropdownValueset;
