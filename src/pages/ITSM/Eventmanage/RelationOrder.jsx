import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Card, Tabs, Input, Row, Col, Button, Table } from 'antd';
import RelationDrawer from './components/RelationDrawer';

const { TabPane } = Tabs;

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


function RelevancyOrder(props) {
  const { location, list, dispatch, relation } = props;
  const [activeKey, setActiveKey] = useState('trouble');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('')

  const callback = (key) => {
    setActiveKey(key)
  }

  const getlist = () => {
    dispatch({
      type: 'relationorder/fetcht',
      payload: {
        orderId: relation ? location.query.orderNo : location.query.No,
        orderType: 'event',
        pageIndex: 0,
        pageSize: 15,
        relationType: activeKey,
      },
    })
  }

  const handleReset = () => {
    console.log('重置')
  }

  useEffect(() => {
    getlist()
  }, [activeKey])

  const columns = [
    {
      title: activeKey === 'problem' ? '问题单编号' : '故障单编码',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '标题',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '状态',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '关联类型',
      dataIndex: 'address2',
      key: 'address2',
    },
  ];
  return (
    <Card>
      <Tabs onChange={callback} activeKey={activeKey}>
        <TabPane tab="故障单" key="trouble" />
        <TabPane tab="问题单" key="problem" />
      </Tabs>
      {activeKey === 'trouble' && (
        <Row>
          <Col span={8}>
            <Input placeholder="请输入故障单号" allowClear />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} >查 询</Button>
            {relation && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => { setVisible(true); setTitle('故障'); }}
              >
                关联工单
              </Button>
            )}
          </Col>
        </Row>
      )}
      {activeKey === 'problem' && (
        <Row>
          <Col span={8}>
            <Input placeholder="请输入问题单号" allowClear />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} >查 询</Button>
            {relation && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => { setVisible(true); setTitle('问题') }}
              >
                关联工单
              </Button>
            )}
          </Col>
        </Row>
      )}
      <Table style={{ marginTop: 16 }} columns={columns} dataSource={list} />
      {relation && visible && (
        <RelationDrawer
          title={`关联${title}单`}
          visible={visible}
          orderIdPre={location.query.mainId}
          orderTypePre='event'
          orderTypeSuf={activeKey}
          ChangeVisible={(v) => setVisible(v)}
        />
      )}
    </Card>
  );
}

export default connect(({ relationorder, loading }) => ({
  list: relationorder.list,
  loading: loading.models.relationorder,
}))(RelevancyOrder);