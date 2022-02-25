import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Select, Badge, Button, Table, Form, Input, Row, Col, DatePicker, Divider, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FilesContext from '@/layouts/MenuContext';
import PatrolconfigModal from './components/PatrolconfigModal';
import PatrolBriefDrawer from './components/PatrolBriefDrawer';
import { saveFileIds, createReport, createInspectionall } from './services/api';
import SysUpload from './components/SysUpload/Upload';

const { Option } = Select;

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

const typemap = [{
  key: '0',
  title: '巡检全部'
}, {
  key: '1',
  title: '巡检配置'
}];

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
      setFieldsValue
    },
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [openviewid, setOpenViewId] = useState('');
  const [filelist, setFilelist] = useState([]);
  const [filelistid, setFilelistId] = useState('');

  // 缓存页签查询条件
  const [tabrecord, setTabRecord] = useState({});
  const searchrecord = {
    user: '',
    type: '',
  };
  let cacheinfo = {};
  cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;

  // 列表请求
  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.time1 = values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '';
    values.time2 = values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '';
    setTabRecord({ ...values });
    dispatch({
      type: 'automation/fetchhostList',
      payload: {
        ...values,
        pageIndex: page,
        pageSize: size,
      },
    });
  };

  // 附件上传
  useEffect(() => {
    if (filelist !== [] && filelistid !== '') {
      saveFileIds({ fileIds: JSON.stringify(filelist), id: filelistid }).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          searchdata(1, 15);
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [filelist, filelistid]);

  const onShowSizeChange = (page, size) => {
    searchdata(1, size);
    setPageinations({
      ...paginations,
      current: 1,
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

  // 分页
  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: hostlist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  // 重置
  const handleReset = () => {
    router.push({
      pathname: `/automation/automaticinspection/hostpatrol`,
      query: { pathpush: true },
      state: { cach: false, }
    });
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  // 查询 
  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  // 跳转巡检明细详情
  const newDetailView = (Id) => {
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: {
          ...tabrecord,
          paginations,
        },
        tabid: sessionStorage.getItem('tabid')
      },
    });
    router.push({
      pathname: '/automation/automaticinspection/hostpatrol/hostview',
      query: {
        Id,
        addtab: true,
        menuDesc: '查看巡检明细',
      },
    })
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...tabrecord,
              paginations,
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      };
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset();
      };
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        const { time1, time2 } = location.state.cacheinfo;
        setFieldsValue({
          time1: time1 ? moment(time1) : '',
          time2: time2 ? moment(time2) : '',
        });
        setPageinations({ ...paginations, current, pageSize });
      };
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    if (cacheinfo !== undefined) {
      const current = location.state?.cacheinfo?.paginations?.current || paginations.current;
      const pageSize = location.state?.cacheinfo?.paginations?.pageSize || paginations.pageSize;
      searchdata(current, pageSize);
    }
  }, []);

  // 下载报告
  const handledownFileToZip = (id, no) => {
    createReport(id).then(res => {
      const filename = `${no}_报告.docx`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  );

  // 打开简报
  const handleShowBrieDrawer = (drawtitle, Id) => {
    setTitle(drawtitle);
    setVisible(!visible);
    if (Id) {
      setOpenViewId(Id);
    }
  };

  const columns = [
    {
      title: '巡检编号',
      dataIndex: 'no',
      key: 'no',
      width: 200,
    },
    {
      title: '巡检人',
      dataIndex: 'user',
      key: 'user',
      width: 200,
    },
    {
      title: '巡检状态',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (text, record) => (
        <span>
          <Badge status={colormap.get(record.status)} text={text} />
        </span>
      ),
    },
    {
      title: '巡检类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
      width: 250,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 250,
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            {(record.status !== '成功') ? <a type="link" disabled
            >
              报告下载
            </a> : <a type="link"
              onClick={() => handledownFileToZip(record.id, record.no)}
            >报告下载</a>}
            <Divider type="vertical" />
            <a type="link"
              onClick={() => {
                handleShowBrieDrawer('巡检简报', record.id);
              }}
            >生成简报</a>
            <Divider type="vertical" />
            <a type="link"
              onClick={() => newDetailView(record.id)}
            >查看明细</a></span>
        );
      },
    },
    {
      title: '上传最终报告',
      dataIndex: 'fileIds',
      key: 'fileIds',
      width: 500,
      render: (_, record) => {
        return (
          <div>
            <FilesContext.Provider value={{
              files: record.fileIds && record.fileIds !== '[]' && record.fileIds !== null ? JSON.parse(record.fileIds) : [],
              ChangeFiles: (v => {
                setFilelist(v);
                setFilelistId(record.id);
              }),
            }}>
              <SysUpload key={record.id} />
            </FilesContext.Provider>
          </div>
        );
      },
    },
  ];

  const setTableHeight = () => {
    let height = 500;
    const clientHeight = window.document?.body?.clientHeight || 500;
    height = clientHeight - 400
    return height;
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <Row>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={6}>
              <Form.Item label="巡检人">
                {getFieldDecorator('user', {
                  initialValue: cacheinfo.user,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="巡检类型">
                {getFieldDecorator('type', {
                  initialValue: cacheinfo.type,
                })(<Select placeholder="请选择" allowClear>
                  {typemap.map(obj => (
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>)}
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
            <Col span={4} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 8 }}>
          <Button type="primary" style={{ marginRight: 8 }}
            onClick={() => createInspectionall().then(res => {
              if (res.code === 200) {
                message.success(res.msg);
                searchdata(1, 15);
              } else {
                message.error(res.msg);
              }
            })}
          >巡检全部</Button>
          <PatrolconfigModal
            onChangeList={() => searchdata(1, 15)}
            pagename='hostpatrol'
          >
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
          scroll={{ x: 1500, y: setTableHeight() }}
        />
        <PatrolBriefDrawer
          visible={visible}
          ChangeVisible={newvalue => setVisible(newvalue)}
          title={title}
          Id={openviewid}
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
