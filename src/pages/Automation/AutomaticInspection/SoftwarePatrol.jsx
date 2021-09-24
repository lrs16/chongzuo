import React, { useState } from 'react';
// import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Badge, Button, Table, Form, Input, Row, Col, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PatrolconfigModal from './components/PatrolconfigModal';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const colormap = new Map([
  ['失败', 'default'],
  ['成功', 'success'],
]);

function SoftwarePatrol(props) {
  const pagetitle = props.route.name;
  const {
    // loading,
    // dispatch,
    // list,
    // location,
    form: {
      getFieldDecorator,
      // getFieldsValue,
      resetFields,
    },
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  // useEffect(() => {
  //   dispatch({
  //     type: 'checkmanage/fetchlist',
  //     payload: { currentPage: paginations.current, pageSize: paginations.pageSize },
  //   });
  // }, []);

  const onShowSizeChange = (page, size) => {
    // getdata(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    // getdata(page, paginations.pageSize);
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
    total: 10,
    onChange: page => changePage(page),
  };

  const handleReset = () => { resetFields(); };

  const handleSearch = () => { };

  const newDetailView = () => {
    router.push({
      pathname: '/automation/automaticinspection/softwarepatrol/softview',
      query: {
        Id: Math.random(),
        addtab: true,
        menuDesc: '查看巡检明细',
      },
    })
  };

  // const handledownFileToZip = (id, no) => {
  //   dispatch({
  //     type: '',
  //     payload: {
  //       id,
  //     },
  //   }).then(res => {
  //     if (res.size === 0 || res.type === 'text/html') {
  //       message.error('下载失败');
  //     } else {
  //       const filename = `${no}_附件.zip`;
  //       const blob = new Blob([res]);
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = filename;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     }
  //   })
  // }

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  );

  const columns = [
    {
      title: '巡检编号',
      dataIndex: 'checkNo',
      key: 'checkNo',
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
      render: (text, record) => (
        <span>
          <Badge status={colormap.get(record.checkStatus)} text={text} />
        </span>
      ),
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
      // render: (text, record) => {
      //   const url = `/inspection/report/download?checkNo=${record.checkNo}`;
      //   const download = () => {
      //     window.location.href = url;
      //   };
      //   const status = record.checkStatus;
      //   // const statustext = status.length === 4 ? '下载报告' : '';
      //   const { checkNo } = record;
      //   return (
      //     <>
      //       {status.length === 4 && status !== 'ERRR' && <a onClick={download}> 下载报告</a>}
      //       {status === 'ERRR' && <a onClick={() => goon(checkNo)}> 继续巡检</a>}
      //     </>
      //   );
      // },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={5}>
              <Form.Item label="报告名称">
                {getFieldDecorator('reportName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="巡检人">
                {getFieldDecorator('checkUser', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="开始时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('startTime', {})(
                      <DatePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        placeholder="开始时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                  <Col span={11}>
                    {getFieldDecorator('endTime', {})(
                      <DatePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('23:59:59', 'HH:mm:ss'),
                        }}
                        placeholder="结束时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={6} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 8 }}>
          <Button type="primary" style={{ marginRight: 8 }}
          >巡检全部</Button>
          <PatrolconfigModal>
            <Button type="primary" style={{ marginRight: 8 }}
            >巡检配置</Button>
          </PatrolconfigModal>
          <Button type="primary" style={{ marginRight: 8 }}
          // onClick={() => handledownFileToZip(record.id, record.no)}
          >报告下载</Button>
          <Button type="primary" style={{ marginRight: 8 }}
            onClick={() => newDetailView()}
          >查看明细</Button>
        </div>
        <Table
          // loading={loading}
          rowKey={record => record.checkNo}
          columns={columns}
          // dataSource={list.records}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(SoftwarePatrol);
// (
//   connect(({ checkmanage, loading }) => ({
//     list: checkmanage.list,
//     loading: loading.models.checkmanage,
//   }))(SoftwarePatrol),
// );
