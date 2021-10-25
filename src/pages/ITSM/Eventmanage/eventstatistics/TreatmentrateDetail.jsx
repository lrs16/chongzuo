import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Button,
  Table
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';

const columns = [
  {
    title: '事件编号',
    dataIndex: 'eventNo',
    key: 'eventNo',
    width: 140,
  },
  {
    title: '事件标题',
    dataIndex: 'title',
    key: 'title',
    width: 250,
  },
  {
    title: '事件来源',
    dataIndex: 'eventSource',
    key: 'eventSource',
    width: 160,
  },
  {
    title: '事件分类',
    dataIndex: 'eventType',
    key: 'eventType',
    width: 100,
  },
  {
    title: '申报人单位',
    dataIndex: 'applicationUnit',
    key: 'applicationUnit',
    width: 180,
  },
  {
    title: '申报人',
    dataIndex: 'applicationUser',
    key: 'applicationUser',
    width: 80,
  },
  {
    title: '工单状态',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
    width: 90,
  },
  {
    title: '登记人',
    dataIndex: 'registerUser',
    key: 'register_user',
    width: 80,
  },
  {
    title: '建单时间',
    dataIndex: 'addTime',
    key: 'addTime',
    width: 120,
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
    width: 120,
  },
  {
    title: '优先级',
    dataIndex: 'eventPrior',
    key: 'eventPrior',
    width: 80,
  },
  {
    title: '申报人部门',
    dataIndex: 'applicationDept',
    key: 'applicationDept',
    width: 270,
  },

  {
    title: '事件对象',
    dataIndex: 'eventObject',
    key: 'eventObject',
    width: 120,
  },
  {
    title: '回访方式',
    dataIndex: 'revisitWay',
    key: 'revisitWay',
    width: 120,
  },

  {
    title: '影响度',
    dataIndex: 'eventEffect',
    key: 'eventEffect',
    width: 80,
  },
  {
    title: '紧急度',
    dataIndex: 'eventEmergent',
    key: 'eventEmergent',
    width: 80,
  },


];

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}



function TreatmentrateDetail(props) {
  const [visible, setVisible] = useState(false);
  const {
    children,
    title,
    eventHandleRatearr,
    detailParams,
    dispatch,
    loading
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const searchdata = (searchParams, pageIndex, pageSize) => {
    dispatch({
      type: 'eventstatistics/getEventHandleRateList',
      payload: {
        ...searchParams,
        pageIndex,
        pageSize
      }
    })
  }

  const onShowSizeChange = (page, size) => {
    searchdata(detailParams,page-1, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };
  
  const changePage = page => {
    searchdata(detailParams,page - 1, paginations.pageSize);
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
    total: eventHandleRatearr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };
  

  const handleopenClick = () => {
    searchdata(detailParams, paginations.current - 1, paginations.pageSize)
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  //  下载
  const download = () => {
    dispatch({
      type: 'eventstatistics/downloadEventHandleRateListExcel',
      payload: {
        ...detailParams,
        pageIndex: paginations.current - 1,
        pageSize: paginations.pageSize
      },
    }).then(res => {
      const filename = `下载事件处理率_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={720}
        centered='true'
        maskClosable='true'
        onClose={handleCancel}
      >
        <Button
          type="primary"
          onClick={() => download()}
          style={{ marginBottom: 10 }}>
          导出数据
        </Button>

        <Table
          loading={loading}
          columns={columns}
          dataSource={eventHandleRatearr.rows}
          rowKey={record => record.id}
          pagination={pagination}
          scroll={{ x: 700 }}
        />


        {/* <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>

          {/* <Button onClick={handleOk} type='primary'>
            确定
          </Button> */}

        {/* </div> */}
      </Drawer>
    </>
  )
}

export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    eventHandleRatearr: eventstatistics.eventHandleRatearr,
    loading: loading.models.eventstatistics,
  }))(TreatmentrateDetail)
)
