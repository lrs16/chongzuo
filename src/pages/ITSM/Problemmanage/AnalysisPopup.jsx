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
function AnalysisPopup(props) {
  const {
    title,
    popupParameters,
    dispatch,
    visible,
    closePop,
    statDetailarr,
    typeName,
    queryArr,
    loading
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  const columns = [
    {
      title: '问题编号',
      dataIndex: 'no',
      key: 'no',
      width: 150,
      fixed: 'left',
      render: (text, record) => {
        const gotoDetail = (text, records) => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                key: 'problem'
              },
              tabid: sessionStorage.getItem('tabid')
            },
          });
          router.push({
            pathname: `/ITSM/problemmanage/problemquery/detail`,
            query: {
              id: records.id,
              taskName: records.statuscn,
              No: records.no,
            },
            state: {
              runpath: '/ITSM/problemmanage/problemquery',
              cacheinfo: {
                key: 'problem',
              },
            }
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
          <span>{text}</span>
        </>
      )
    },
    {
      title: '问题分类',
      dataIndex: 'type',
      key: 'type',
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
      title: '问题描述',
      dataIndex: 'content',
      key: 'content',
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
      title: '问题申报人',
      dataIndex: 'complainUser',
      key: 'complainUser',
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
      title: '开发负责人',
      dataIndex: 'developmentLead',
      key: 'developmentLead',
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
      title: '建单时间',
      dataIndex: 'addTime',
      key: 'addTime',
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
      title: '系统运维商确认结果',
      dataIndex: 'confirmOneResult',
      key: 'confirmOneResult',
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
      title: '处理完成时间',
      dataIndex: 'handleTime',
      key: 'handleTime',
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
      title: '系统开发商处理人',
      dataIndex: 'handler',
      key: 'handler',
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
      title: '计划完成时间',
      dataIndex: 'planEndTime',
      key: 'planEndTime',
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
      title: '处理解决方案',
      dataIndex: 'handleContent',
      key: 'handleContent',
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
      title: '系统开发商处理结果',
      dataIndex: 'handleResult',
      key: 'handleResult',
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
      title: '问题登记人员确认结果',
      dataIndex: 'confirmThreeResult',
      key: 'confirmThreeResult',
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
      title: '问题登记人员确认人',
      dataIndex: 'confirmThreeUser',
      key: 'confirmThreeUser',
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
  ];

  const timeoutList = (values, pageNum, pageSize) => {
    dispatch({
      type: 'problemmanage/queryList',
      payload: {
        pageNum,
        pageSize,
        ...values
      }
    })
  }

  useEffect(() => {
    if (visible && popupParameters) {
      if (typeName) {
        timeoutList(popupParameters, 1, 10)
      } else {
        dispatch({
          type: 'problemmanage/fetchstatDetail',
          payload: {
            ...popupParameters
          }
        })
      }
    }
  }, [visible, popupParameters])

  const handleCancel = () => {
    closePop();
  }

  //  下载
  const download = () => {
    dispatch({
      type: typeName ? 'problemmanage/eventdownload' : 'problemmanage/fetchstatDownload',
      payload: popupParameters,
    }).then(res => {
      const filename = `问题钻取${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  const onShowSizeChange = (page, pageSize) => {
    timeoutList(popupParameters, page, pageSize);
    setPageinations({
      ...paginations,
      pageSize,
    });
  };


  const changePage = page => {
    timeoutList(popupParameters, page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  }

  const pagination = {
    // showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: queryArr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const pagination2 = {
    showTotal: () => `总共  ${statDetailarr && statDetailarr.length}  条记录`,
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

        {
          typeName && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={queryArr.rows}
              rowKey={records => records.id}
              pagination={pagination}
              scroll={{ x: 800, y: 700 }}
            />
          )
        }

        {
          !typeName && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={statDetailarr}
              rowKey={record => record.id}
              scroll={{ x: 700, y: 800 }}
              pagination={pagination2}
            />
          )
        }


      </Drawer>
    </>
  )
}

export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    statDetailarr: problemmanage.statDetailarr,
    queryArr: problemmanage.queryArr,
    loading: loading.models.problemmanage,
  }))(AnalysisPopup)
)
