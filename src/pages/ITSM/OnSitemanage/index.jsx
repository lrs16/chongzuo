import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Badge, Button, Table, Message, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import axios from 'axios';

function OnSitemanage(props) {
  const { dispatch, list, loading } = props;
  const pagetitle = props.route.name;
  const dataSource = list.records;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

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
      if (res.cood === 200) {
        getdata(1, 10)
      }
    }

    );
  };

  const handlewholeNet = () => {
    // return dispatch({
    //   type: 'checkmanage/dowholeNet',
    // }).then(res => {
    //   getdata(1, 10);
    //   if (res.code === 200) {
    //     Message.success(res.msg);
    //   } else {
    //     Message.error(res.msg);
    //   }
    // });

    const url = 'http://10.172.210.132:8083/inspection/wholeNet/check';
    axios
      .get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        },
      })
      .then(res => {
        const { data } = res;
        if (data.code === 200) {
          Message.success(res.msg);
          getdata(1, 10);
        } else {
          Message.error(data.msg);
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

  const goon = checkNo => {
    // return dispatch({
    //   type: 'checkmanage/goonwholeNet',
    //   payload: checkNo
    // })

    const url = `http://10.172.210.132:8083/inspection/wholeNet/check?checkNo=${checkNo}`;
    axios
      .get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      })
      .then(res => {
        const { data } = res;
        if (data.code === 200) {
          Message.success(data.msg);
          getdata(1, 10);
        } else {
          Message.error(data.msg);
        }
      });
  };

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
            {status === 'W' && status !== 'ERRR' && (
              <Badge status={statuswaitico} text={statuswaitetext} />
            )}
            {status !== 'W' && status !== 'ERRR' && <Badge status={statusico} text={statustext} />}
            {status === 'ERRR' && <Badge status="error" text="巡检被中断" />}
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
        // const statustext = status.length === 4 ? '下载报告' : '';
        const { checkNo } = record
        return (
          <>
            {status.length === 4 && status !== 'ERRR' && <a onClick={download}> 下载报告</a>}
            {status === 'ERRR' && <a onClick={() => goon(checkNo)}> 继续巡检</a>}
          </>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Button
              onClick={() => {
                getdata(1, 10);
                setPageinations({ current: 1, pageSize: 15 });
              }}
              type="primary"
              style={{ marginBottom: 24, float: 'right' }}
            >
              刷新
            </Button>
          </Col>
          <Col span={12}>
            <Button onClick={() => handleCheck()} block type="dashed">
              计量主站巡检
            </Button>
          </Col>
          <Col span={12}>
            <Button onClick={handlewholeNet} block type="dashed">
              网级平台巡检
            </Button>
          </Col>
        </Row>
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
