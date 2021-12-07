import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Tabs, Input, Row, Col, Button, Table, } from 'antd';
import RelationDrawer from './components/RelationDrawer';

const { TabPane } = Tabs;

function RelevancyOrder(props) {
  const {
    location,
    list,
    dispatch,
    relation,
    statuscode,
    orderId,
    search,
    assessNo
  } = props;

  const [activeKey, setActiveKey] = useState('event');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [searchkey, setSearchKey] = useState('');
  const [searchrow, setSearchRow] = useState(undefined);

  const callback = (key) => {
    setActiveKey(key)
  }

  const getlist = (pageIndex, pageSize) => {
    switch (activeKey) {
      case 'trouble':
      case 'problem':
      case 'demand':
      case 'event':
        dispatch({
          type: 'relationorder/fetcht',
          payload: {
            orderId,
            orderType: 'quality',
            pageIndex,
            pageSize,
            relationType: activeKey,
          },
        })
        break;
      case 'release':
        dispatch({
          type: 'relationorder/relesefetcht',
          payload: { assessNo, orderType: 'FB' }
        })
        break;
      default:
        break;
    }
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

  const handleSearch = () => {
    const newArr = (list.rows || list).filter(item => {
      return item.orderNo.includes(searchkey);
    });

    if (newArr.length > 0) {
      setSearchRow(newArr);
    } else {
      setSearchRow([]);
    }
  }

  useEffect(() => {
    setSearchRow(undefined);
    getlist(paginations.current - 1, paginations.pageSize)
  }, [activeKey])

  useEffect(() => {
    if (statuscode === 200) {
      getlist(paginations.current - 1, paginations.pageSize)
    }
  }, [statuscode])

  let notype;
  switch (activeKey) {
    case 'event':
      notype = '事件单'
      break;
    case 'trouble':
      notype = '故障单'
      break;
    case 'problem':
      notype = '问题单'
      break;
    case 'demand':
      notype = '需求单'
      break;
    case 'release':
      notype = '发布单'
      break;
    default:
      break;
  }

  const columns = [
    {
      title: `${notype}编号`,
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        const handleClick = () => {
          switch (activeKey) {
            case 'event':
              router.push({
                pathname: `/ITSM/eventmanage/query/details`,
                query: {
                  pangekey: record.status,
                  id: record.id,
                  mainId: record.mainId,
                  No: text,
                },
              });
              break;
            case 'trouble':
              router.push({
                pathname: `/ITSM/faultmanage/querylist/record`,
                query: {
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
            case 'demand':
              router.push({
                pathname: `/ITSM/demandmanage/query/details`,
                query: {
                  taskId: record.mainId,
                  mainId: record.mainId,
                  taskName: record.status,
                  No: text,
                },
              });
              break;
            case 'release':
              router.push({
                pathname: `/ITSM/releasemanage/query/details`,
                query: {
                  Id: record.orderNo,
                  taskName: record.taskName,
                },
                state: {
                  dynamicpath: true,
                  menuDesc: '发布工单详情',
                }
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
        <TabPane tab="故障单" key="trouble" />
        <TabPane tab="问题单" key="problem" />
        <TabPane tab="需求单" key="demand" />
        <TabPane tab="发布单" key="release" />
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
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)} >重 置</Button>

            {relation && !search && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => { setVisible(true); setTitle('事件'); }}
              >
                关联工单
              </Button>
            )}
          </Col>

        </Row>
      )}

      {activeKey === 'trouble' && (
        <Row>
          <Col span={8}>
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入故障单号"
              allowClear
            />
          </Col>


          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)} >重 置</Button>

            {relation && !search && (
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
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入故障单号"
              allowClear
            />
          </Col>


          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)} >重 置</Button>

            {relation && !search && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => { setVisible(true); setTitle('问题'); }}
              >
                关联工单
              </Button>
            )}
          </Col>

        </Row>
      )}


      {activeKey === 'demand' && (
        <Row>
          <Col span={8}>
            <Input
              onChange={e => setSearchKey(e.target.value)}
              placeholder="请输入需求单号"
              allowClear
            />
          </Col>


          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)} >重 置</Button>

            {relation && !search && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => { setVisible(true); setTitle('需求'); }}
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
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)} >重 置</Button>
            {relation && !search && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => { setVisible(true); setTitle('发布') }}
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
        dataSource={(searchrow === undefined) ? (list.rows || list) : searchrow}
        rowKey={r => r.id}
        pagination={pagination}
      />
      {relation && visible && (
        <RelationDrawer
          title={title}
          assessNo={assessNo}
          visible={visible}
          orderIdPre={location.query.mainId}
          orderTypePre='quality'
          orderTypeSuf={activeKey}
          ChangeVisible={(v) => setVisible(v)}
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