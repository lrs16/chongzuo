import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import AdminAuth from '@/components/AdminAuth';
import { exportRepairOrder, delRepairOrder } from './services/tick';
import DictLower from '@/components/SysDict/DictLower';

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

function TickemergentList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue },
    loading,
    dispatch,
    location,
    list,
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [username, setUserName] = useState('');

  // 缓存页签查询条件
  const [tabrecord, setTabRecord] = useState({});
  const searchrecord = { no: '', taskName: '' };
  let cacheinfo = {};
  cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;

  // 查询
  const searchdata = (values, page, size) => {
    dispatch({
      type: 'tickemergent/fetchlist',
      payload: {
        ...values,
        occurrenceTime1: values.beginTime
          ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        occurrenceTime2: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        pageSize: size,
        pageIndex: page,
      },
    });
    setTabRecord({
      ...values,
      beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
    });
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    const values = getFieldsValue();
    searchdata(values, paginations.current, paginations.pageSize);
  };

  // 重置
  const handleReset = () => {
    router.push({
      pathname: `/ITSM/faultmanage/tickemergent/list`,
      query: { pathpush: true },
      state: { cach: false },
    });
    resetFields();
    searchdata(searchrecord, 1, 15);
  };

  // 页签
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
              expand,
              key: 'repair',
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset();
      }
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
      }
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    if (cacheinfo) {
      const values = getFieldsValue();
      const current = location.state?.cacheinfo?.paginations?.current || paginations.current;
      const pageSize = location.state?.cacheinfo?.paginations?.pageSize || paginations.pageSize;
      searchdata(values, current, pageSize);
    }
    return () => {
      setSelectData([]);
      setExpand(false);
    };
  }, []);

  //  导出/下载
  const download = () => {
    const values = getFieldsValue();
    const formval = {
      ...values,
      occurrenceTime1: values.beginTime
        ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss')
        : '',
      occurrenceTime2: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
    };
    exportRepairOrder(formval).then(res => {
      if (res) {
        const filename = `应急抢修票_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.error('下载失败');
      }
    });
  };

  // 删除
  const handleDel = () => {
    if (selectedRowKeys.length > 0) {
      delRepairOrder(selectedRowKeys.join(',')).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          handleSearch();
          setSelectedRowKeys([]);
        } else {
          message.error(res.msg || '删除失败');
          setSelectedRowKeys([]);
        }
      });
    }
  };

  const onShowSizeChange = (_, size) => {
    const values = getFieldsValue();
    searchdata(values, 1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
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
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    // setSelectedRecords(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
  };

  const columns = [
    {
      title: '抢修票编号',
      dataIndex: 'no',
      key: 'no',
      fixed: 'left',
      sorter: (a, b) => a.no.localeCompare(b.no),
      render: (text, record) => {
        const handleClick = () => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
                key: 'repair',
              },
              tabid: sessionStorage.getItem('tabid'),
            },
          });
          router.push({
            pathname: `/ITSM/faultmanage/tickemergent/details`,
            query: {
              Id: record.id,
              taskName: record.taskName,
            },
            state: {
              dynamicpath: true,
              menuDesc: '抢修票工单详情',
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '当前处理环节',
      dataIndex: 'taskName',
      key: 'taskName',
      onCell: () => {
        return {
          style: {
            maxWidth: 400,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '当前处理人',
      dataIndex: 'taskUser',
      key: 'taskUser',
      onCell: () => {
        return {
          style: {
            maxWidth: 400,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '抢修负责人',
      dataIndex: 'addUser',
      key: 'addUser',
    },
    {
      title: '故障发生时间',
      dataIndex: 'occurrenceTime',
      key: 'occurrenceTime',
      sorter: (a, b) => a.occurrenceTime.localeCompare(b.occurrenceTime),
    },
    {
      title: '故障范围',
      dataIndex: 'troubleRange',
      key: 'troubleRange',
      onCell: () => {
        return {
          style: {
            maxWidth: 400,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '抢修内容',
      dataIndex: 'content',
      key: 'content',
      onCell: () => {
        return {
          style: {
            maxWidth: 400,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '风险应对措施',
      dataIndex: 'risk',
      key: 'risk',
      onCell: () => {
        return {
          style: {
            maxWidth: 400,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
  ];

  const extra = (
    <>
      <Button type="primary" onClick={() => handleSearch()}>
        查 询
      </Button>
      <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>
        重 置
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        type="link"
        onClick={() => {
          setExpand(!expand);
          cacheinfo.expand = !expand;
        }}
      >
        {expand ? (
          <>
            关 闭 <UpOutlined />
          </>
        ) : (
          <>
            展 开 <DownOutlined />
          </>
        )}
      </Button>
    </>
  );

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 536;
      } else {
        height = clientHeight - 420;
      }
    }
    return height;
  };

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0]?.children || [];
    }
    return [];
  };

  const tasknamemap = getTypebyId(13334); // 单位

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="13330"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="抢修票编号">
                {getFieldDecorator('no', {
                  initialValue: cacheinfo.no,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('taskName', {
                  initialValue: cacheinfo.taskName,
                })(
                  <Select placeholder="请选择" allowClear>
                    {tasknamemap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="当前处理人"
                style={{ display: expand || cacheinfo.expand ? 'block' : 'none' }}
              >
                {getFieldDecorator('taskUser', {
                  initialValue: cacheinfo.taskUser,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="抢修负责人"
                style={{ display: expand || cacheinfo.expand ? 'block' : 'none' }}
              >
                {getFieldDecorator('addUser', {
                  initialValue: cacheinfo.addUser,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="故障发生时间"
                style={{ display: expand || cacheinfo.expand ? 'block' : 'none' }}
              >
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('beginTime', {
                    initialValue: cacheinfo.beginTime ? moment(cacheinfo.beginTime) : '',
                  })(
                    <DatePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('00:00:00', 'HH:mm:ss'),
                      }}
                      placeholder="开始时间"
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ minWidth: 120, width: '100%' }}
                    />,
                  )}
                </div>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
                  -
                </span>
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('endTime', {
                    initialValue: cacheinfo.endTime ? moment(cacheinfo.endTime) : '',
                  })(
                    <DatePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('23:59:59', 'HH:mm:ss'),
                      }}
                      placeholder="结束时间"
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ minWidth: 120, width: '100%' }}
                    />,
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col
              span={8}
              style={{
                marginTop: expand || cacheinfo.expand ? 4 : 0,
                paddingLeft: expand || cacheinfo.expand ? '8.7%' : '24px',
              }}
            >
              {extra}
            </Col>
          </Form>
        </Row>
        <div>
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>
            导出数据
          </Button>
          <AdminAuth getAuth={v => setUserName(v)} code="admin" />
          {username === 'admin' && (
            <Popconfirm title="确定删除吗？" onConfirm={() => handleDel()}>
              <Button
                type="danger"
                ghost
                style={{ marginRight: 8 }}
                disabled={selectedRowKeys.length === 0}
              >
                删 除
              </Button>
            </Popconfirm>
          )}
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows || []}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.id}
          scroll={{ y: setTableHeight() }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ tickemergent, loading }) => ({
    list: tickemergent.list,
    loading: loading.effects['tickemergent/fetchlist'],
  }))(TickemergentList),
);
