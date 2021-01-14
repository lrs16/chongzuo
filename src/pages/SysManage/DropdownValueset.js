import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Table,
  Button,
  Message,
  Row,
  Col,
  Divider,
  Popconfirm,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictTree from '@/components/DictTree';
import DropdownValueEdit from './components/DropdownValueEdit';
import DropdownValueAdd from './components/DropdownValueAdd';

@connect(({ umpsdropdown, loading }) => ({
  umpsdropdown,
  loading: loading.models.umpsdropdown,
}))

class DropdownValueset extends Component {
  state = {
    current: 1,
    pageSize: 10,
    parentId: '0',
    bodyParams: {
      dictCode: '',
      dictModule: '',
      dictName: '',
      dictRemarks: '',
      dictState: '',
      dictType: '',
      isModify: '',
    },
  };

  componentDidMount() {
    this.getlist();
  }

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { bodyParams, parentId } = this.state;
    bodyParams.pid = parentId;
    this.props.dispatch({
      type: 'umpsdropdown/getSearchDropdownValueList',
      payload: {
        page,
        limit,
        bodyParams,
      },
    })
  };

  getChildValue = (val) => { // 获取pid
    const pid = val[0];
    this.setState({ parentId: pid })
    const { dispatch } = this.props;
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { bodyParams } = this.state;
    bodyParams.pid = pid;

    dispatch({
      type: 'umpsdropdown/getSearchDropdownValueList',
      payload: {
        page,
        limit,
        bodyParams,
      },
    });
  }

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'umpsdropdown/getSearchDropdownValueList',
      payload: {
        bodyParams: this.state.bodyParams,
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
      type: 'umpsdropdown/getSearchDropdownValueList',
      payload: {
        bodyParams: this.state.bodyParams,
        page,
        limit: this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  handleDelete = (id) => { // 删除
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

  handleEdite = values => { // 编辑
    console.log(values)
    const { dispatch } = this.props;
    const { dictCode, dictModule, dictName, dictRemarks, dictSort, dictType } = values;
    const { parentId } = this.state;
    const pid = parentId;
    const listValues = values;
    listValues.pid = parentId;

    return dispatch({
      type: 'umpsdropdown/edite',
      payload: {
        dictCode, dictModule, dictName, dictRemarks, dictSort, dictType, pid
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
      } else {
        Message.error(res.msg);
      }
    });
  };

  // eslint-disable-next-line consistent-return
  handleAdd = values => { // 添加
    const { dispatch } = this.props;
    const { dictCode, dictModule, dictName, dictRemarks, dictSort, dictState, dictType } = values;
    const { parentId } = this.state;
    const pid = parentId;
    if (parentId) {
      return dispatch({
        type: 'umpsdropdown/fetchAdd',
        payload: {
          dictCode, dictModule, dictName, dictRemarks, dictSort, dictState, dictType, pid
        },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error(res.msg);
        }
      });
    }
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
      total: list.total,
      onChange: page => this.changePage(page),
    };

    const columns = [
      {
        title: '数据编号',
        dataIndex: 'id',
        key: 'id',
        width: 200,
      },
      {
        title: '字典模块',
        dataIndex: 'dictModule',
        key: 'dictModule',
        width: 100,
      },
      {
        title: '字典类型',
        dataIndex: 'dictType',
        key: 'dictType',
        width: 100,
      },
      {
        title: '字典代码',
        dataIndex: 'dictCode',
        key: 'dictCode',
        width: 100,
      },
      {
        title: '字典名称',
        dataIndex: 'dictName',
        key: 'dictName',
        width: 200,
      },
      {
        title: '字典状态',
        dataIndex: 'dictStateExt',
        key: 'dictStateExt',
        width: 100,
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
        width: 200,
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
        width: 100,
      },
      {
        title: '字典备注',
        dataIndex: 'dictRemarks',
        key: 'dictRemarks',
        width: 200,
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
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
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
      <PageHeaderWrapper>
        <Row
          style={{ background: '#f1f1f1' }}>
          <Col span={5}>
            <Card bordered={false}>
              <DictTree
                toFatherValue={this.getChildValue}
              />
            </Card>
          </Col>
          <Col span={19}>
            <Card style={{ marginLeft: 8 }} bordered={false}>
              <DropdownValueAdd onSumit={this.handleAdd} parentId={this.state.parentId}>
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  type="dashed"
                  icon="plus"

                >
                  添加字典
                  </Button>
              </DropdownValueAdd>

              <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={record => record.id}
                pagination={pagination}
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default DropdownValueset;
