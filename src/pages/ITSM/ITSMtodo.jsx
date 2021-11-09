import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const columns = [
  {
    title: '工单号',
    dataIndex: 'itemWorkId',
    key: 'itemWorkId',
    with: 140,
    fixed: 'left',
    render: (text, record) => {
      const handleClick = () => {
        switch (record.itemWorkType) {
          case 'event':
            router.push({
              pathname: `/ITSM/eventmanage/to-do/record/workorder`,
              query: {
                taskName: record.itemWorkStatus,
                taskId: record.taskId,
                mainId: record.instanceId,
                orderNo: text,
                check: record.itemCheckStatus,
              },
            });
            break;
          case 'trouble':
            router.push({
              pathname: `/ITSM/faultmanage/todolist/record`,
              query: {
                // id: record.taskId,
                taskName: record.taskName,
                id: record.taskId,
                mainId: record.instanceId,
                result: '1',
                orderNo: text,
              },
            });
            break;
          case 'problem':
            router.push({
              pathname: `/ITSM/problemmanage/besolveddetail/workorder`,
              query: {
                id: record.taskId,
                taskName: record.currentNode,
                mainId: record.instanceId,
                orderNo: text,
              },
            });
            break;
          case 'demand':
            router.push({
              pathname: `/ITSM/demandmanage/to-do/record/workorder`,
              query: {
                taskName: record.taskName,
                taskId: record.taskId,
                mainId: record.instanceId,
                result: '1',
                orderNo: text,
              },
            });
            break;
          case 'operation':
            router.push({
              pathname: `/ITSM/operationplan/operationplanform`,
              query: {
                flowNodeName: record.nodeName,
                mainId: record.instanceId,
                status: record.itemWorkStatus,
                checkStatus: record.itemCheckStatus,
                orderNo: record.itemWorkId,
              }
            })
            break;
          case 'work':
            router.push({
              pathname: `/ITSM/supervisework/workplandetail`,
              query: {
                mainId: record.instanceId,
                flowNodeName: record.nodeName,
                status: record.itemWorkStatus,
                checkStatus: record.itemCheckStatus,
                Id: text,
              },
              state: {
                dynamicpath: true,
                menuDesc: '工作任务',
              }
            })
            break;
          default:
            break;
        }
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '工单类型',
    dataIndex: 'itemWorkType',
    key: 'itemWorkType',
    with: 100,
    fixed: 'left',
    sorter: (a, b) => a.itemWorkType.length - b.itemWorkType.length,
    render: text => {
      const typemap = new Map([
        ['event', '事件'],
        ['trouble', '故障'],
        ['problem', '问题'],
        ['demand', '需求'],
        ['operation', '作业计划'],
        ['work', '工作督办']
      ]);
      return typemap.get(text);
    },
  },
  {
    title: '标题',
    dataIndex: 'itemName',
    key: 'itemName',
    with: 250,
    fixed: 'left',
  },
  {
    title: '描述',
    dataIndex: 'itemContent',
    key: 'itemContent',
    with: 250,
    onCell: () => {
      return {
        style: {
          maxWidth: 250,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: 'pointer'
        }
      }
    },
    render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
  },
  {
    title: '当前处理环节',
    dataIndex: 'taskName',
    key: 'taskName',
    with: 150,
  },
  {
    title: '超时状态',
    dataIndex: 'timeoutTimeStatus',
    key: 'timeoutTimeStatus',
    with: 100,
    sorter: (a, b) => a.itemWorkType.length - b.itemWorkType.length,
    render: text => {
      const statusmap = new Map([
        ['0', '正常'],
        ['1', '即将超时'],
        ['2', '已超时'],
      ]);
      return statusmap.get(text);
    },
  },
  {
    title: '到达时间',
    dataIndex: 'todoTime',
    key: 'todoTime',
    with: 150,
  },
];

function ITSMtodo(props) {
  const { eventlist, loading, location } = props;
  const pagetitle = props.route.name;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const { dispatch } = props;

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'global/fetchallevent',
      payload: {
        todoUserId: values,
        pageNum: page,
        pageSize: size,
      },
    });
  };
  const onShowSizeChange = (page, size) => {
    const values = sessionStorage.getItem('userauthorityid');
    searchdata(values, page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = sessionStorage.getItem('userauthorityid');
    searchdata(values, page, paginations.pageSize);
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
    total: eventlist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  useEffect(() => {
    dispatch({
      type: 'global/fetchallevent',
      payload: {
        todoUserId: sessionStorage.getItem('userauthorityid'),
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  }, []);

  // 重置
  const handleReset = () => {
    dispatch({
      type: 'global/fetchallevent',
      payload: {
        todoUserId: sessionStorage.getItem('userauthorityid'),
        pageNum: 1,
        pageSize: 15,
      },
    });
    setPageinations({ current: 1, pageSize: 15 });
  };

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新
      handleReset()
    }
  }, [location.state]);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={eventlist.rows}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1400 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ global, loading }) => ({
  eventlist: global.eventlist,
  loading: loading.models.global,
}))(ITSMtodo);
