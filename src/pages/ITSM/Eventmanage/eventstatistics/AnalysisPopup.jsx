import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Button,
  Table,
  Tooltip,
  Icon
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';

const colorArr = new Map([
  ['已超时', 'red'],
  ['未超时', 'green'],
  ['即将超时', 'orange'],
]);
const textmap = new Map([
  ['未超时', '#52C41A'],
  ['即将超时', 'orange'],
  ['已超时', 'red']
]);
function AnalysisPopup(props) {
  const {
    title,
    popupParameters,
    dispatch,
    visible,
    closePop,
    list,
    typeName,
    loading
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  const searchdata = (values, pageIndex, pageSize) => {
    dispatch({
      type: 'eventquery/fetchlist',
      payload: {
        ...values,
        pageIndex,
        pageSize,
      }
    })
  }

  const getOrderObjectByRoot = (values, pageIndex, pageSize) => {
    dispatch({
      type: 'eventquery/fetchgetOrderObjectByRoot',
      payload: {
        ...values,
        pageIndex,
        pageSize,
      }
    })
  }

  const querytimeout = (values, pageIndex, pageSize) => {
    dispatch({
      type: 'eventquery/fetchquerytimeout',
      payload: {
        ...values,
        pageIndex,
        pageSize,
      }
    })
  }

  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 140,
      render: (text, record) => {
        const gotoDetail = (text, records) => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                key: 'event'
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          router.push({
            pathname: `/ITSM/eventmanage/query/details`,
            query: {
              pangekey: records.eventStatus,
              id: records.taskId,
              mainId: records.id,
              No: text,
            },
          });
        };
        return <a onClick={() => gotoDetail(text, record)} type='link'>{text}</a>
      }
    },
    {
      title: '当前处理环节',
      dataIndex: 'flowNodeName',
      key: 'flowNodeName',
      width: 150,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '超时状态',
      dataIndex: 'timeoutStatus',
      key: 'timeoutStatus',
      width: 150,
      render: (text) => (
        <>
          <Icon type="alert" style={{ fontSize: '1.4em', color: colorArr.get(text), marginRight: '8px' }} />
          <span style={{ color: textmap.get(text)}}>{text}</span>
        </>
      )
    },
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '事件来源',
      dataIndex: 'eventSource',
      key: 'eventSource',
      width: 160,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '事件分类',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 100,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '申报人单位',
      dataIndex: 'applicationUnit',
      key: 'applicationUnit',
      width: 180,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '申报人',
      dataIndex: 'applicationUser',
      key: 'applicationUser',
      width: 80,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '工单状态',
      dataIndex: 'eventStatus',
      key: 'eventStatus',
      width: 90,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '登记人',
      dataIndex: 'registerUser',
      key: 'register_user',
      width: 80,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '建单时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'eventPrior',
      key: 'eventPrior',
      width: 80,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '申报人部门',
      dataIndex: 'applicationDept',
      key: 'applicationDept',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },

    {
      title: '事件对象',
      dataIndex: 'eventObject',
      key: 'eventObject',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '回访方式',
      dataIndex: 'revisitWay',
      key: 'revisitWay',
      width: 120,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },

    {
      title: '影响度',
      dataIndex: 'eventEffect',
      key: 'eventEffect',
      width: 80,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '紧急度',
      dataIndex: 'eventEmergent',
      key: 'eventEmergent',
      width: 80,
      align: 'center',
      ellipsis: true,
      render: text => {
        return (
          <Tooltip
            placement="topLeft"
            title={text}
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
          >
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    if (visible && popupParameters) {
      switch (typeName) {
        case '事件总数':
          getOrderObjectByRoot(popupParameters, 1, 10)
          break;
        case '超时情况':
          querytimeout(popupParameters, 0, 10)
          break;
        case '':
          searchdata(popupParameters, 0, 10)
          break;
        default:
          break;
      }
    }
  }, [visible, popupParameters])

  const onShowSizeChange = (page, size) => {
    switch (typeName) {
      case '事件总数':
        getOrderObjectByRoot(popupParameters, page, size)
        break;
      case '超时情况':
        querytimeout(popupParameters, page - 1, size)
        break;
      case '':
        searchdata(popupParameters, page - 1, size)
        break;
      default:
        break;
    }

    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    switch (typeName) {
      case '事件总数':
        getOrderObjectByRoot(popupParameters, page, paginations.pageSize)
        break;
      case '超时情况':
        querytimeout(popupParameters, page - 1, paginations.pageSize)
        break;
      case '':
        searchdata(popupParameters, page - 1, paginations.pageSize)
        break;
      default:
        break;
    }
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

  const handleCancel = () => {
    closePop();
    setPageinations({
      current: 1,
      pageSize: 10
    })
  }

  //  下载
  const download = () => {
    switch (typeName) {
      case '事件总数':
        dispatch({
          type: 'eventquery/fetchdownloadOrderObjectByRoot',
          payload: popupParameters,
        }).then(res => {
          const filename = `事件查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '超时情况':
        dispatch({
          type: 'eventtimeout/download',
          payload: popupParameters,
        }).then(res => {
          const filename = `事件查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      case '':
        dispatch({
          type: 'eventquery/eventdownload',
          payload: {
            values: popupParameters,
            ids: []
          }
        }).then(res => {
          const filename = `事件查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Drawer
        title={title}
        visible={visible}
        width={1000}
        centered
        maskClosable
        onClose={handleCancel}
        destroyOnClose='true'
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
          dataSource={list.rows}
          rowKey={record => record.id}
          pagination={pagination}
          scroll={{ x: 700, y: 800 }}
        />
      </Drawer>
    </>
  )
}

export default Form.create({})(
  connect(({ eventquery, loading }) => ({
    list: eventquery.list,
    loading: loading.models.eventquery,
  }))(AnalysisPopup)
)
