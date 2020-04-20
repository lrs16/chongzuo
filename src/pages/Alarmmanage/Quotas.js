import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Card, Table, Badge, Button, Switch, Divider } from 'antd';

const statusMap = ['success', 'red', 'orange'];
const status = ['正常', '报警', '数据不足'];

const enableMap = ['processing', 'default'];
const enables = ['启用', '禁用'];
@connect(({ alarmrule, loading }) => ({
  alarmrule,
  loading: loading.models.alarmrule,
}))
class Quotas extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmrule/fetch',
    });
  }

  render() {
    const columns = [
      {
        title: '编码',
        dataIndex: 'ruleid',
        key: 'ruleid',
        render: (text, record) => (
          <span>
            <Link to={`/alarmmanage/details/detailview/${record.ruleid}`}>{text}</Link>
          </span>
        ),
        // render: text => <Link to={`/profile/basic/${text.replace(/\s+/gi, '-')}`}>{text}</Link>,
      },
      {
        title: '规则名称',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.status]} text={status[record.status]} />
          </span>
        ),
      },
      {
        title: '启用',
        dataIndex: 'enable',
        key: 'enable',
        render: (text, record) => (
          <span>
            <Badge status={enableMap[record.enable]} text={enables[record.enable]} />
          </span>
        ),
      },
      {
        title: '监控资源',
        dataIndex: 'resourcestype',
        key: 'resourcestype',
      },
      {
        title: '报警规则',
        dataIndex: 'alarmrule',
        key: 'alarmrule',
      },
      {
        title: '通知对象',
        dataIndex: 'Objects',
        key: 'Objects',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 300,
        render: (text, record) => (
          <span>
            <a>修改</a>
            <Divider type="vertical" />
            <a>告警历史</a>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        ),
      },
    ];
    const {
      alarmrule: { list },
    } = this.props;
    const dataSource = [...list];
    return (
      <Card>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          // onClick={this.newMember}
          icon="plus"
        >
          创建告警规则
        </Button>
        <Table dataSource={dataSource} rowKey={record => record.ruleid} columns={columns} />
      </Card>
    );
  }
}

export default Quotas;
