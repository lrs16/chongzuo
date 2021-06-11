import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
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
  const [activeKey, setActiveKey] = useState('event');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const callback = (key) => {
    setActiveKey(key)
  }

  const getlist = (pageIndex, pageSize) => {
    dispatch({
      type: 'relationorder/fetcht',
      payload: {
        orderId: location.query.mainId,
        orderType: 'trouble',
        pageIndex,
        pageSize,
        relationType: activeKey,
      },
    })
  }

  const onShowSizeChange = (page, size) => {
    getlist(page - 1, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    getlist(page - 1, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  useEffect(() => {
    getlist(paginations.current - 1, paginations.pageSize)
  }, [activeKey])

  const columns = [
    {
      title: activeKey === 'event' ? '事件单编号' : '问题单编码',
      dataIndex: 'orderNo',
      key: 'orderNo',
      // render: (text, record) => {
      //   const handleClick = () => {
      //     router.push({
      //       pathname: `/ITSM/eventmanage/query/details`,
      //       query: {
      //         pangekey: record.eventStatus,
      //         id: record.taskId,
      //         mainId: record.id,
      //         No: text,
      //       },
      //     });
      //   };
      //   return <a onClick={handleClick}>{text}</a>;
      // },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '关联类型',
      dataIndex: 'relationType',
      key: 'relationType',
    },
  ];
  return (
    <Card>
      <Tabs onChange={callback} activeKey={activeKey}>
        <TabPane tab="事件单" key="event" />
        <TabPane tab="问题单" key="problem" />
      </Tabs>
      {activeKey === 'event' && (
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
      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={list.rows}
        rowKey={r => r.id}
        pagination={pagination}
      />
      {relation && visible && (
        <RelationDrawer
          title={`关联${title}单`}
          visible={visible}
          orderIdPre={location.query.mainId}
          orderTypePre='trouble'
          orderTypeSuf={activeKey}
          ChangeVisible={(v) => setVisible(v)}
          SaveRefresh={() => getlist(0, 15)}
        />
      )}
    </Card>
  );
}

export default connect(({ relationorder, loading }) => ({
  list: relationorder.list,
  loading: loading.models.relationorder,
}))(RelevancyOrder);