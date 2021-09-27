import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Badge, Button, Table, Form, Input, Row, Col, DatePicker, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload/Upload';
import FilesContext from '@/layouts/MenuContext';
import PatrolconfigModal from './components/PatrolconfigModal';
import PatrolBriefDrawer from './components/PatrolBriefDrawer';

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
  ['失败', 'error'],
  ['成功', 'success'],
  ['巡检中', 'blue'],
]);

function HostPatrol(props) {
  const pagetitle = props.route.name;
  const {
    loading,
    dispatch,
    hostlist,
    location,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    },
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.time1 = values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '';
    values.time2 = values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '';
    dispatch({
      type: 'automation/fetchhostList',
      payload: {
        values,
        pageIndex: page,
        pageSize: size,
      },
    });
  };

  useEffect(() => {
    searchdata(1, 15);
  }, [location]);

  const onShowSizeChange = (page, size) => {
    searchdata(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(page, paginations.pageSize);
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
    total: hostlist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  const newDetailView = () => {
    router.push({
      pathname: '/automation/automaticinspection/hostpatrol/hostview',
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

  const handleShowBrieDrawer = (drawtitle) => {
    setTitle(drawtitle);
    setVisible(!visible);
  };

  const columns = [
    {
      title: '巡检编号',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '巡检人',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '巡检状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span>
          <Badge status={colormap.get(record.status)} text={text} />
        </span>
      ),
      // render: (text, record) => {
      //   const status = record.checkStatus;
      //   const statuswaitetext = '等待巡检';
      //   const statuswaitico = 'processing';
      //   const statustext = status.length === 4 ? '成功' : '巡检中';
      //   const statusico = status.length === 4 ? 'success' : 'error';
      //   return (
      //     <>
      //       {status === 'W' && status !== 'ERRR' && (
      //         <Badge status={statuswaitico} text={statuswaitetext} />
      //       )}
      //       {status !== 'W' && status !== 'ERRR' && <Badge status={statusico} text={statustext} />}
      //       {status === 'ERRR' && <Badge status="error" text="巡检被中断" />}
      //     </>
      //   );
      // },
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
      width: 400,
      render: (text, record) => {
        // const url = `/inspection/report/download?checkNo=${record.checkNo}`;
        // const download = () => {
        //   window.location.href = url;
        // };
        // const status = record.checkStatus;
        // // const statustext = status.length === 4 ? '下载报告' : '';
        // const { checkNo } = record;
        // return (
        //   <>
        //     {status.length === 4 && status !== 'ERRR' && <a onClick={download}> 下载报告</a>}
        //     {status === 'ERRR' && <a onClick={() => goon(checkNo)}> 继续巡检</a>}
        //   </>
        // );
        return (
          <div style={{ display: 'flex' }}>
            <a type="link"
            // onClick={() => handledownFileToZip(record.id, record.no)}
            >报告下载</a>
            <Divider type="vertical" />
            <a type="link"
              onClick={() => {
                handleShowBrieDrawer('巡检简报');
              }}
            >生成简报</a>
            <Divider type="vertical" />
            <a type="link"
              onClick={() => newDetailView()}
            >查看明细</a>
            <Divider type="vertical" />
            <FilesContext.Provider value={{
              files: [],
              ChangeFiles: (v => { console.log(v); }),
            }}>
              <SysUpload />
            </FilesContext.Provider>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={5}>
              <Form.Item label="巡检人">
                {getFieldDecorator('user', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="开始时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time1', {})(
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
                    {getFieldDecorator('time2', {})(
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
        </div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          columns={columns}
          dataSource={hostlist.rows}
          pagination={pagination}
        />
        <PatrolBriefDrawer
          visible={visible}
          ChangeVisible={newvalue => setVisible(newvalue)}
          title={title}
          destroyOnClose
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ automation, loading }) => ({
    hostlist: automation.hostlist,
    loading: loading.models.automation,
  }))(HostPatrol),
);
