import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Tabs, Input, Row, Col, Button, Table, } from 'antd';
import RelationDrawer from './components/RelationDrawer';

const { TabPane } = Tabs;

const typemap = new Map([
  ['release', '发布'],
  ['tempRelease', '临时发布'],
  ['quality', '服务绩效'],
])

function RelevancyOrder(props) {
  const { location: { query: { mainId } }, list, dispatch, relation, statuscode, loading } = props;
  const [activeKey, setActiveKey] = useState('release');
  const [visible, setVisible] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [searchkey, setSearchKey] = useState('');
  const [searchrow, setSearchRow] = useState(undefined);
  const [clearsearchkey, setClearsearchkey] = useState(false);

  const callback = (key) => {
    setSearchRow(undefined);
    setClearsearchkey(false);
    setPageinations({ current: 1, pageSize: 15 });
    setActiveKey(key);
  }

  const getlist = (pageIndex, pageSize) => {
    dispatch({
      type: 'relationorder/fetcht',
      payload: {
        orderId: mainId,
        orderType: 'demand',
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
  }

  useEffect(() => {
    if (activeKey) {
      getlist(paginations.current - 1, paginations.pageSize)
    }
  }, [activeKey])

  useEffect(() => {
    if (statuscode === 200 && visible) {
      getlist(paginations.current - 1, paginations.pageSize)
    }
  }, [statuscode])

  const columns = [
    {
      title: `${typemap.get(activeKey)}单编码`,
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        const handleClick = () => {
          if (activeKey === 'release') {
            router.push({
              pathname: `/ITSM/releasemanage/plan/query/details`,
              query: {
                Id: text,
                taskName: record.status,
              },
              state: {
                dynamicpath: true,
                menuDesc: '发布工单详情',
              }
            });
          };
          if (activeKey === 'quality') {
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
    },
  ];

  return (
    <Card>
      <div onMouseDown={() => setClearsearchkey(true)} onMouseUp={() => setClearsearchkey(false)}>
        <Tabs onChange={callback} activeKey={activeKey}>
          <TabPane tab="发布单" key="release" />
          <TabPane tab="临时发布单" key="tempRelease" />
          <TabPane tab="服务绩效" key="quality" />
        </Tabs>
      </div>
      {!clearsearchkey && (
        <Row>
          <Col span={8}>
            <Input onChange={e => setSearchKey(e.target.value)} placeholder={`请输入${typemap.get(activeKey)}单号`} allowClear />
          </Col>
          <Col span={8}>
            <Button type="primary" style={{ marginLeft: 16 }} onClick={() => handleSearch()} >本页查询</Button>
            <Button style={{ marginLeft: 16 }} onClick={() => setSearchRow(undefined)} >重 置</Button>
            {relation && <Button type="primary" style={{ marginLeft: 8 }} onClick={() => { setVisible(true) }} >关联工单</Button>}
          </Col>
        </Row>
      )}
      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={searchrow === undefined ? list.rows : searchrow}
        rowKey={r => r.id}
        pagination={pagination}
        loading={loading}
      />
      {relation && visible && (
        <RelationDrawer
          title={typemap.get(activeKey)}
          visible={visible}
          orderIdPre={mainId}
          orderTypePre='demand'
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