import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const columns = [
  {
    title: '工单号',
    dataIndex: 'itemWorkId',
    key: 'itemWorkId',
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
              },
            });
            break;
          case 'trouble':
            router.push({
              pathname: `/ITSM/faultmanage/todolist/record`,
              query: {
                id: record.taskId,
              },
            });
            break;
          case 'problem':
            router.push({
              pathname: `/ITSM/problemmanage/besolveddetail/workorder`,
              query: {
                id: record.taskId,
                taskName: record.currentNode,
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
    title: '工单类型',
    dataIndex: 'itemWorkType',
    key: 'itemWorkType',
    sorter: (a, b) => a.itemWorkType.length - b.itemWorkType.length,
    sortDirections: ['descend'],
    render: text => {
      const typemap = new Map([
        ['event', '事件'],
        ['trouble', '故障'],
        ['problem', '问题'],
        ['demand', '需求'],
      ]);
      return typemap.get(text);
    },
  },
  {
    title: '标题',
    dataIndex: 'itemName',
    key: 'itemName',
  },
  {
    title: '描述',
    dataIndex: 'itemContent',
    key: 'itemContent',
  },
  {
    title: '当前处理环节',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '超时状态',
    dataIndex: 'timeoutTimeStatus',
    key: 'timeoutTimeStatus',
    sorter: (a, b) => a.itemWorkType.length - b.itemWorkType.length,
    sortDirections: ['descend'],
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
    sorter: (a, b) => a.itemWorkType.length - b.itemWorkType.length,
    sortDirections: ['descend'],
  },
];

function ITSMtodo(props) {
  const { eventlist, loading } = props;
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

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={eventlist.rows}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ global, loading }) => ({
  eventlist: global.eventlist,
  loading: loading.models.global,
}))(ITSMtodo);
