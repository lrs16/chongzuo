import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Card, Table, Button, Badge, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const gradeMap = ['red', 'orange', 'blue'];
const grade = ['特急', '紧急', '一般'];

const ackstatusMap = ['success', 'error'];
const ackstatus = ['已确认', '未确认'];
const notification = ['已通知', '未通知'];

const eliminateMap = ['error', 'success', 'default'];
const eliminate = ['未消除', '已消除', '已取消'];

@connect(({ alarmdetails, loading }) => ({
  alarmdetails,
  loading: loading.models.alarmdetails,
}))
class Details extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmdetails/fetch',
    });
  }

  render() {
    const columns = [
      {
        title: '编码',
        dataIndex: 'detailsid',
        key: 'detailsid',
        render: (text, record) => (
          <span>
            <Link to={`/alarmmanage/details/detailview/${record.detailsid}`}>{text}</Link>
          </span>
        ),
        // render: text => <Link to={`/profile/basic/${text.replace(/\s+/gi, '-')}`}>{text}</Link>,
      },
      {
        title: '紧急程度',
        dataIndex: 'grade',
        key: 'grade',
        render: (text, record) => (
          <span>
            <Tag color={gradeMap[record.grade]}>{grade[record.grade]}</Tag>
          </span>
        ),
      },
      {
        title: '告警类别',
        dataIndex: 'category',
        key: 'scriptType',
      },
      {
        title: '告警内容',
        dataIndex: 'detailname',
        key: 'detailname',
      },
      {
        title: '确认状态',
        dataIndex: 'ackstatus',
        key: 'ackstatus',
        render: (text, record) => (
          <span>
            <Badge status={ackstatusMap[record.ackstatus]} text={ackstatus[record.ackstatus]} />
          </span>
        ),
      },
      {
        title: '消除状态',
        dataIndex: 'eliminate',
        key: 'eliminate',
        render: (text, record) => (
          <span>
            <Badge status={eliminateMap[record.eliminate]} text={eliminate[record.eliminate]} />
          </span>
        ),
      },
      {
        title: '通知',
        dataIndex: 'notification',
        key: 'notification',
        render: (text, record) => (
          <span>
            <Badge
              status={ackstatusMap[record.notification]}
              text={notification[record.notification]}
            />
          </span>
        ),
      },
      {
        title: '最新发生时间',
        dataIndex: 'latesttime',
        key: 'latesttime',
      },
      {
        title: '受影响资源',
        dataIndex: 'resoure',
        key: 'resoure',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 300,
        render: (text, record) => (
          <span>
            <Button type="link">确认</Button>
            <Button type="link">手工消除</Button>
            <Button type="link">取消确认</Button>
          </span>
        ),
      },
    ];
    const {
      alarmdetails: { list },
    } = this.props;
    const dataSource = [...list];
    return (
      <PageHeaderWrapper title="告警明细信息">
        <Card>
          <Table
            dataSource={dataSource}
            rowKey={record => record.detailsid}
            columns={columns}
            scroll={{ x: 1500 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Details;
