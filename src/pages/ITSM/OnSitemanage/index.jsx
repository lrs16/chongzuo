import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Badge, Button, Table, Message, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import axios from 'axios';
import { downloadreport } from './services/api';

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
      title: '????????????',
      dataIndex: 'checkNo',
      key: 'checkNo',
    },
    {
      title: '????????????',
      dataIndex: 'reportName',
      key: 'reportName',
    },
    {
      title: '????????????',
      dataIndex: 'checkType',
      key: 'checkType',
    },
    {
      title: '?????????',
      dataIndex: 'checkUser',
      key: 'checkUser',
    },
    {
      title: '????????????',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      render: (text, record) => {
        const status = record.checkStatus;
        const statuswaitetext = '????????????';
        const statuswaitico = 'processing';
        const statustext = status.length === 4 ? '??????' : '?????????';
        const statusico = status.length === 4 ? 'success' : 'error';
        return (
          <>
            {status === 'W' && status !== 'ERRR' && (
              <Badge status={statuswaitico} text={statuswaitetext} />
            )}
            {status !== 'W' && status !== 'ERRR' && <Badge status={statusico} text={statustext} />}
            {status === 'ERRR' && <Badge status="error" text="???????????????" />}
          </>
        );
      },
    },
    {
      title: '????????????',
      dataIndex: 'beginTime',
      key: 'beginTime',
    },
    {
      title: '????????????',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '??????',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => {

        //  const url = `/inspection/report/download?checkNo=${record.checkNo}`;
        const download = () => {
          // window.location.href = url;
          downloadreport(record.checkNo).then(res => {
            if (res) {
              const filename = `????????????????????????_${record.checkNo}.docx`;
              const blob = new Blob([res]);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
            }
          })
        };
        const status = record.checkStatus;
        // const statustext = status.length === 4 ? '????????????' : '';
        const { checkNo } = record
        return (
          <>
            {status.length === 4 && status !== 'ERRR' && <a onClick={download}> ????????????</a>}
            {status === 'ERRR' && <a onClick={() => goon(checkNo)}> ????????????</a>}
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
              ??????
            </Button>
          </Col>
          <Col span={12}>
            <Button onClick={() => handleCheck()} block type="dashed">
              ??????????????????
            </Button>
          </Col>
          <Col span={12}>
            <Button onClick={handlewholeNet} block type="dashed">
              ??????????????????
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
