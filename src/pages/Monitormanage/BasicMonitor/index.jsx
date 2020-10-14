import React, { useState } from 'react';
import { Button, Badge, Tag, Table, Card, Row, Col, Form, Input } from 'antd';
import { MiniProgress } from '@/components/Charts';
import { connect } from 'dva';
import numeral from 'numeral';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Detail from './components/Detail';

const statusMap = ['default', 'processing'];
const status = ['离线', '在线'];

const Index = ({ dispatch, monitorlist }) => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectDetail, setSelectDetail] = useState({});

  const getHost = () => {
    dispatch({
      type: 'monitorlist/fetchhost',
      payload: { current: 1, pageSize: 10 },
    });
  };

  const openDetailHandle = data => {
    setSelectDetail(data);
    setDetailVisible(true);
  };

  getHost();

  const columns = [
    {
      title: '告警状态',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => openDetailHandle(record)}>
            {text}
          </Button>
        </span>
      ),
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '监控分类',
      dataIndex: 'monitorType',
      key: 'monitorType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text, record) => (
        <span>
          <Badge status={statusMap[record.status]} text={status[record.status]} />
        </span>
      ),
    },
    {
      title: 'CPU使用率',
      dataIndex: 'cpuUsage',
      key: 'cpuUsage',
      width: 120,
      render: text => (
        <span>
          {numeral(text).format('0,0.00')}%
          <MiniProgress percent={text} strokeWidth={8} target={80} />
        </span>
      ),
    },
    {
      title: '内存使用率',
      dataIndex: 'memoryUsage',
      key: 'memoryUsage',
      width: 120,
      render: text => (
        <span>
          {numeral(text).format('0,0.00')}%
          <MiniProgress percent={text} strokeWidth={8} target={80} />
        </span>
      ),
    },
    {
      title: '负载(15m)',
      dataIndex: 'load',
      key: 'load',
      width: 100,
      render: text => <span>{numeral(text).format('0,0.00')}</span>,
    },
    {
      title: 'IO读速率',
      dataIndex: 'ioReadRate',
      key: 'ioReadRate',
      width: 100,
      render: text => <span>{numeral(text).format('0,0.00')}</span>,
    },
    {
      title: 'IO写速率',
      dataIndex: 'ioWriteRate',
      key: 'ioWriteRate',
      width: 100,
      render: text => <span>{numeral(text).format('0,0.00')}</span>,
    },
    {
      title: '标签',
      dataIndex: 'applyLabel',
      key: 'applyLabel',
      render: applyLabel => (
        <span>
          {applyLabel.map(tag => (
            <Tag key={tag} style={{ marginBottom: 2, marginTop: 2 }}>
              {tag}
            </Tag>
          ))}
        </span>
      ),
    },
  ];

  const {
    loading,
    upmsdept: { data },
  } = this.props;

  const { getFieldDecorator } = this.props.form;

  return (
    <PageHeaderWrapper title="主机监测">
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="搜索关键字">
            {getFieldDecorator('seacherkey', {})(<Input placeholder="输入名称/IP" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="监控分类">
            {getFieldDecorator('sort', {})(<Input placeholder="输入名称/IP" />)}
          </Form.Item>
        </Col>
      </Row>
      <Table dataSource={monitorlist.data} rowKey={record => record.id} columns={columns} />
      <Detail data={selectDetail} visible={detailVisible} onClose={() => setDetailVisible(false)} />
    </PageHeaderWrapper>
  );
};

export default connect(({ monitorlist }) => ({
  monitorlist,
}))(Index);
