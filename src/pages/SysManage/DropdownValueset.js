import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Table, Button, Message, Row, Col, Divider, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictTree from '@/components/DictTree';
import DropdownValueEdit from './components/DropdownValueEdit';
import DropdownValueAdd from './components/DropdownValueAdd';

@connect(({ umpsdropdown, dicttree, loading }) => ({
  umpsdropdown,
  dicttree,
  loading: loading.models.umpsdropdown,
}))
class DropdownValueset extends Component {
  state = {
    current: 1,
    pageSize: 15,
    parentId: '0',
    bodyParams: {
      dictCode: '',
      dictModule: '',
      dictName: '',
      dictRemarks: '',
      dictState: '1',
      dictType: '',
      isModify: '',
    },
  };

  componentDidMount() {
    this.getlist();
    this.getall();
  }

  componentDidUpdate() {
    const propsstate = this.props.location.state;
    if (propsstate && propsstate.reset) {
      this.resetquekey();
      this.props.dispatch({
        type: 'umpsdropdown/getSearchDropdownValueList',
        payload: {
          page: 1,
          limit: 15,
          bodyParams: {
            dictCode: '',
            dictModule: '',
            dictName: '',
            dictRemarks: '',
            dictState: '1',
            dictType: '',
            isModify: '',
          },
        },
      });
      this.getall();
      router.push({
        pathname: `/sysmanage/dropdownvalueset`,
        state: { cach: false, reset: false }
      });

    }
  }

  resetquekey = () => {
    this.setState({
      current: 1,
      pageSize: 15,
      parentId: '0',
      bodyParams: {
        dictCode: '',
        dictModule: '',
        dictName: '',
        dictRemarks: '',
        dictState: '1',
        dictType: '',
        isModify: '',
      },
    })
  }

  getall = () => {
    this.props.dispatch({
      type: 'dicttree/fetch',
      payload: {
        params: {
          pid: '',
          dictModule: '',
          dictType: '',
          dictCode: '',
          dictName: '',
          dictRemarks: '',
        },
      },
    });
  };

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
    });
  };

  getChildValue = val => {
    // ??????pid
    const pid = val[0];
    this.setState({ parentId: pid });
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
  };

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

  handleDelete = id => {
    // ??????
    const { dispatch } = this.props;
    return dispatch({
      type: 'umpsdropdown/remove',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
        this.getall();
      } else {
        Message.error(res.msg);
      }
    });
  };

  handleEdite = (values, record) => {
    // ??????
    const { dispatch } = this.props;
    const { dictCode, dictModule, dictName, dictRemarks, dictSort, dictType } = values;
    const { parentId } = this.state;
    const pid = parentId;
    const listValues = values;
    listValues.pid = parentId;
    const ids = record.id;
    return dispatch({
      type: 'umpsdropdown/edite',
      payload: {
        dictCode,
        dictModule,
        dictName,
        dictRemarks,
        dictSort,
        dictType,
        pid,
        id: ids,
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
        this.getall();
      } else {
        Message.error(res.msg);
      }
    });
  };

  // eslint-disable-next-line consistent-return
  handleAdd = values => {
    // ??????
    const { dispatch } = this.props;
    const { dictCode, dictModule, dictName, dictRemarks, dictSort, dictState, dictType } = values;
    const { parentId } = this.state;
    const pid = parentId;
    if (parentId) {
      return dispatch({
        type: 'umpsdropdown/fetchAdd',
        payload: {
          dictCode,
          dictModule,
          dictName,
          dictRemarks,
          dictSort,
          dictState,
          dictType,
          pid,
        },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
          this.getall();
        } else {
          Message.error(res.msg);
        }
      });
    }
  };

  render() {
    const {
      umpsdropdown: { list },
      dicttree: { data },
    } = this.props;
    const dataSource = list.rows;

    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: list.total,
      showTotal: total => `??????  ${total}  ?????????`,
      onChange: page => this.changePage(page),
    };

    const columns = [
      {
        title: '????????????',
        dataIndex: 'id',
        key: 'id',
        width: 200,
      },
      {
        title: '????????????',
        dataIndex: 'dictModule',
        key: 'dictModule',
        width: 200,
      },
      {
        title: '????????????',
        dataIndex: 'dictType',
        key: 'dictType',
        width: 200,
      },
      {
        title: '????????????',
        dataIndex: 'dictCode',
        key: 'dictCode',
        width: 100,
      },
      {
        title: '????????????',
        dataIndex: 'dictName',
        key: 'dictName',
        width: 200,
      },
      {
        title: '????????????',
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
        title: '???????????????',
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
        title: '????????????',
        dataIndex: 'dictSort',
        key: 'dictSort',
        width: 100,
      },
      {
        title: '????????????',
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
        title: '?????????',
        dataIndex: 'createUserNameExt',
        key: 'createUserNameExt',
        width: 100,
      },
      {
        title: '????????????',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a, b) => a.createTime - b.createTime,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
      },
      {
        title: '????????????',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: (a, b) => a.updateTime - b.updateTime,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
      },
      {
        title: '??????',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
        render: (text, record) => (
          <div>
            <DropdownValueEdit record={record} onSumit={values => this.handleEdite(values, record)}>
              <a type="link">??????</a>
            </DropdownValueEdit>
            <Divider type="vertical" />
            <Popconfirm title="???????????????????????????" onConfirm={() => this.handleDelete(record.id)}>
              <a type="link">??????</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Row style={{ background: '#f1f1f1' }}>
          <Col span={5}>
            <Card
              bordered={false}
              style={{
                maxHeight: 750,
                overflowY: 'auto',
              }}
            >
              {(!this.props.location.state || (this.props.location.state && !this.props.location.state.reset)) && (
                <DictTree toFatherValue={this.getChildValue} data={data} />
              )}
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
                  ????????????
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
