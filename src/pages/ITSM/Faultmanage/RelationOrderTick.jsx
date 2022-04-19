import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Tabs, Input, Row, Col, Button, Table, Tooltip } from 'antd';
import RelationTickDrawer from './components/RelationTickDrawer';

const { TabPane } = Tabs;

function RelevancyOrder(props) {
  const { location, list, dispatch, relation, statuscode } = props;
  const [visible, setVisible] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [searchkey, setSearchKey] = useState('');
  const [searchrow, setSearchRow] = useState(undefined);

  const getlist = (pageIndex, pageSize) => {
    dispatch({
      type: 'relationorder/fetcht',
      payload: {
        orderId: location.query.Id,
        orderType: 'repair',
        pageIndex,
        pageSize,
        relationType: 'trouble',
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
    if (statuscode === 200 && visible) {
      getlist(paginations.current - 1, paginations.pageSize);
    }
  }, [statuscode]);

  useEffect(() => {
    getlist(paginations.current - 1, paginations.pageSize);
  }, []);

  const columns = [
    {
      title: '故障单编码',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record) => {
        const handleClick = () => {
          router.push({
            pathname: `/ITSM/faultmanage/querylist/record`,
            query: {
              id: record.mainId,
              No: text,
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      onCell: () => {
        return {
          style: {
            maxWidth: 400,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
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
      <div>
        <Tabs>
          <TabPane tab="故障单" key="trouble" />
        </Tabs>
      </div>
      <Row>
        <Col span={8}>
          <Input
            onChange={e => setSearchKey(e.target.value)}
            placeholder="请输入故障单号"
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
              }}
            >
              关联工单
            </Button>
          )}
        </Col>
      </Row>
      <Table
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={searchrow === undefined ? list.rows : searchrow}
        rowKey={r => r.id}
        pagination={pagination}
      />
      {relation && visible && (
        <RelationTickDrawer
          title="故障"
          visible={visible}
          orderIdPre={location.query.Id}
          orderTypePre="repair"
          orderTypeSuf="trouble"
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
