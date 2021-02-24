import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Badge, Button, Table, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const columns = [
  {
    title: '巡检编号',
    dataIndex: 'checkNo',
    key: 'checkNo',
  },
  {
    title: '报告名称',
    dataIndex: 'reportName',
    key: 'reportName',
  },
  {
    title: '巡检类型',
    dataIndex: 'checkType',
    key: 'checkType',
  },
  {
    title: '巡检人',
    dataIndex: 'checkUser',
    key: 'checkUser',
  },
  {
    title: '巡检状态',
    dataIndex: 'checkStatus',
    key: 'checkStatus',
    render: (text, record) => {
      const status = record.checkStatus;
      const statuswaitetext = '等待巡检';
      const statuswaitico = 'processing';
      const statustext = status.length === 4 ? '成功' : '巡检中';
      const statusico = status.length === 4 ? 'success' : 'error';
      return (
        <>
          {status === 'W' && <Badge status={statuswaitico} text={statuswaitetext} />}
          {status !== 'W' && <Badge status={statusico} text={statustext} />}
        </>
      );
    },
  },
  {
    title: '开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => {
      const url = `/inspection/report/download?checkNo=${record.checkNo}`;
      const download = () => {
        window.location.href = url;
      };
      const status = record.checkStatus;
      const statustext = status.length === 4 ? '下载报告' : '';
      return <a onClick={download}>{statustext}</a>;
    },
  },
];
function OnSitemanage(props) {
  const { dispatch, list, loading } = props;
  const pagetitle = props.route.name;
  const dataSource = list.records;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    dispatch({
      type: 'checkmanage/fetchlist',
      payload: { currentPage: paginations.current, pageSize: paginations.pageSize },
    });
  }, []);

  const getdata = (page, size) => {
    dispatch({
      type: 'checkmanage/fetchlist',
      payload: {
        currentPage: page,
        pageSize: size,
      },
    });
  };

  const handleCheck = () => {
    return dispatch({
      type: 'checkmanage/docheck',
    }).then(res => {
      getdata(1, 10);
      if (res.code === 200) {
        Message.success(res.msg);
      } else {
        Message.error(res.msg);
      }
    });
  };

  const onShowSizeChange = (page, size) => {
    getdata(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    getdata(page, paginations.pageSize);
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
    onChange: page => changePage(page),
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Button
          onClick={() => getdata(1, 10)}
          type="primary"
          style={{ marginBottom: 24, float: 'right' }}
        >
          刷新
        </Button>
        <Button onClick={handleCheck} type="dashed" block style={{ marginBottom: 24 }}>
          执行巡检
        </Button>
        <Table
          loading={loading}
          rowKey={record => record.checkNo}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ checkmanage, loading }) => ({
  list: checkmanage.list,
  loading: loading.models.checkmanage,
}))(OnSitemanage);
