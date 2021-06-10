import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Table } from 'antd';


function RelationDrawer(props) {
  const { dispatch, title, visible, orderIdPre, orderTypePre, orderTypeSuf, ChangeVisible, orderlist } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSave = () => {
    dispatch({
      type: 'relationorder/saverelation',
      payload: {
        orderIdPre,
        orderIdSuf: selectedRowKeys,
        orderTypePre,
        orderTypeSuf,
        relationType: 1
      },
    })
  }

  const hanldleCancel = () => {
    ChangeVisible(false)
  };

  const handleSearch = () => {
    if (orderTypeSuf === 'trouble') {
      dispatch({
        type: 'relationorder/fetchtrouble',
        payload: {
          no: '',
          status: '',
          pageIndex: 0,
          pageSize: 200,
        },
      })
    };
    if (orderTypeSuf === 'problem') {
      dispatch({
        type: 'relationorder/fetchtrouble',
        payload: {
          no: '',
          status: '',
          pageIndex: 0,
          pageSize: 200,
        },
      })
    }
  }

  useEffect(() => {
    handleSearch()
  }, [orderTypeSuf])

  const columns = [
    {
      title: orderTypeSuf === 'problem' ? '问题单编号' : '故障单编码',
      dataIndex: 'no',
      key: 'no',
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
  ];
  return (
    <>
      <Drawer
        title={title}
        width={600}
        onClose={hanldleCancel}
        visible={visible}
        bodyStyle={{ paddingBottom: 60 }}
        destroyOnClose
      >

        <Table
          columns={columns}
          dataSource={orderlist}
          rowKey={(_, index) => index.toString()}
          rowSelection={rowSelection}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 999
          }}
        >
          <Button type='primary' onClick={() => handleSave()} style={{ marginRight: 8 }}>保存</Button>
          <Button onClick={() => hanldleCancel()} style={{ marginRight: 8 }}>关闭</Button>
        </div>
      </Drawer>
    </>
  );
}

export default connect(({ relationorder, loading }) => ({
  orderlist: relationorder.order,
  loading: loading.models.relationorder,
}))(RelationDrawer);