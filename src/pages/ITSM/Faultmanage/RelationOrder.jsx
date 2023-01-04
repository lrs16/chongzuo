import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Tabs, Input, Row, Col, Button, Table } from 'antd';
import RelationDrawer from './components/RelationDrawer';

const { TabPane } = Tabs;

function RelevancyOrder(props) {
  const { orderId, list, dispatch, relation, statuscode } = props;
  const [activeKey, setActiveKey] = useState('event');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [searchkey, setSearchKey] = useState('');
  const [searchrow, setSearchRow] = useState(undefined);

  const callback = key => {
    setActiveKey(key);
    setSearchRow(undefined);
    dispatch({
      type: 'relationorder/fetcht',
      payload: {
        orderId,
        orderType: 'trouble',
        pageIndex: 1,
        pageSize: 15,
        relationType: key,
      },
    });
  };

  const getlist = (pageIndex, pageSize) => {
    dispatch({
      type: 'relationorder/fetcht',
      payload: {
        orderId,
        orderType: 'trouble',
        pageIndex,
        pageSize,
        relationType: activeKey,
      },
    });
  };

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

  const handleSearch = () => {
    const { rows } = list;
    const newArr = rows.filter(item => {
      return item.orderNo.includes(searchkey);
    });
    if (newArr.length > 0) {
      setSearchRow(newArr);
    } else {
      setSearchRow([]);
    }
  };

  useEffect(() => {
    if (activeKey) {
      getlist(paginations.current - 1, paginations.pageSize);
    }
  }, [activeKey]);

  useEffect(() => {
    if (statuscode === 200) {
      getlist(paginations.current - 1, paginations.pageSize);
    }
  }, [statuscode]);

  let orderNotype;
  switch (activeKey) {
    case 'problem':
      orderNotype = '问题单编号';
      break;
    case 'event':
      orderNotype = '事件单编号';
      break;
    case 'release':
      orderNotype = '发布单编号';
      break;
    case 'quality':
      orderNotype = '绩效单编号';
      break;
    case 'repair':
      orderNotype = '抢修票编号';
    break;
    default:
      break;
  }

  const columns = [
    {
      title: orderNotype,
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        const handleClick = () => {
          switch (activeKey) {
            case 'event':
              router.push({
                pathname: `/ITSM/eventmanage/query/details`,
                query: {
                  pangekey: record.eventStatus,
                  id: record.mainId,
                  No: text,
                },
              });
              break;
            case 'problem':
              router.push({
                pathname: `/ITSM/problemmanage/problemquery/detail`,
                query: {
                  id: record.mainId,
                  taskName: record.status,
                  No: text,
                },
              });
              break;
            case 'release':
              router.push({
                pathname: `/ITSM/releasemanage/plan/query/details`,
                query: {
                  Id: record.orderNo,
                  taskName: record.status,
                },
                state: {
                  dynamicpath: true,
                  menuDesc: '发布工单详情',
                },
              });
              break;
            case 'quality':
              router.push({
                pathname:
                  '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
                query: {
                  assessNo: text,
                  mainId: record.mainId,
                  taskId: '',
                  instanceId: record.mainId,
                  taskName: record.status,
                  orderNo: text,
                  search: true,
                },
              });
              break;
              case 'repair':
              router.push({
                pathname: `/ITSM/faultmanage/tickemergent/details`,
                query: {
                  Id: record.mainId,
                  taskName: record.status,
                },
                state: {
                  dynamicpath: true,
                  menuDesc: '抢修票工单详情',
                },
              });
              break;
            default:
              break;
          }
        };
        return <a onClick={handleClick}>{text}</a>;
      },
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
        <TabPane tab="计划发布单" key="release" />
        <TabPane tab="绩效单" key="quality" />
        <TabPane tab="抢修票单" key="repair" />
      </Tabs>
      {activeKey === 'event' && (
        <Row>
          <Col span={8}>
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入事件单号"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()}>
              本页查询
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)}>
              重 置
            </Button>
            {relation && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setVisible(true);
                  setTitle('事件');
                }}
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
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入问题单号"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }}>
              本页查询
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)}>
              重 置
            </Button>
            {relation && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setVisible(true);
                  setTitle('问题');
                }}
              >
                关联工单
              </Button>
            )}
          </Col>
        </Row>
      )}
      {activeKey === 'release' && (
        <Row>
          <Col span={8}>
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入发布单号"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()}>
              本页查询
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)}>
              重 置
            </Button>
            {relation && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setVisible(true);
                  setTitle('发布');
                }}
              >
                关联工单
              </Button>
            )}
          </Col>
        </Row>
      )}
      {activeKey === 'quality' && (
        <Row>
          <Col span={8}>
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入绩效单号"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()}>
              本页查询
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)}>
              重 置
            </Button>
            {relation && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setVisible(true);
                  setTitle('绩效');
                }}
              >
                关联工单
              </Button>
            )}
          </Col>
        </Row>
      )}
      {activeKey === 'repair' && (
        <Row>
          <Col span={8}>
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入抢修票单号"
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()}>
              本页查询
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)}>
              重 置
            </Button>
            {relation && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setVisible(true);
                  setTitle('抢修票');
                }}
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
        dataSource={searchrow === undefined ? list.rows : searchrow}
        rowKey={r => r.id}
        pagination={pagination}
      />
      {relation && visible && (
        <RelationDrawer
          title={title}
          visible={visible}
          orderIdPre={orderId}
          orderTypePre="trouble"
          orderTypeSuf={activeKey}
          ChangeVisible={v => setVisible(v)}
        />
      )}
    </Card>
  );
}

export default connect(({ relationorder, loading }) => ({
  list: relationorder.list,
  statuscode: relationorder.statuscode,
  loading: loading.models.relationorder,
}))(RelevancyOrder);
