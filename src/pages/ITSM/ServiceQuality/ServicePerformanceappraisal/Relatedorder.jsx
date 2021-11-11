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

  const [activeKey, setActiveKey] = useState('trouble');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [searchkey, setSearchKey] = useState('');
  const [searchrow, setSearchRow] = useState(undefined);

  const callback = (key) => {
    setActiveKey(key)
  }

  const getlist = (pageIndex, pageSize) => {
    if (activeKey === 'trouble') {
      dispatch({
        type: 'relationorder/fetcht',
        payload: {
          orderId,
          orderType: 'AssessNO',
          pageIndex,
          pageSize,
          relationType: activeKey,
        },
      })
    } else {
      dispatch({
        type: 'relationorder/relesefetcht',
        payload: { assessNo, orderType: 'FB' }
      })
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

  const columns = [
    {
      title: activeKey === 'trouble' ? '故障单编号' : '发布单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        const handleClick = () => {
          if (activeKey === 'trouble') {
            router.push({
              pathname: `/ITSM/faultmanage/querylist/record`,
              query: {
                id: record.mainId,
                No: text,
              },
            });
          };
          if (activeKey === 'release') {
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

          };

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
      render: (text) => {
        return <span>普通关联</span>
      }
    },
  ];

  return (
    <Card>
      <Tabs onChange={callback} activeKey={activeKey}>
        <TabPane tab="故障单" key="trouble" />
        <TabPane tab="发布单" key="release" />
      </Tabs>
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
          orderTypePre='AssessNO'
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