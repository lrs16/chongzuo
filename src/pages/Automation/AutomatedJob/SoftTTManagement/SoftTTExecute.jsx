import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Table,
  Card,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Divider,
  message,
  Popconfirm,
  Icon,
  Popover,
  Checkbox
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import { runAutoSoftWork, stopAutoSoftWork, endAutoSoftWork } from './services/api';
import TaskWorkObjectModel from './components/TaskWorkObjectModel';
import SoftWorkLogsDrawer from './components/SoftWorkLogsDrawer';

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

function SoftTTExecute(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location,
    autosoftworklist,
    loading,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
      setFieldsValue
    },
  } = props;

  let formThead;

  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visibledrawer, setVisibledrawer] = useState(false); // 抽屉是否显示
  const [titledrawer, setTitledrawer] = useState('');
  const [recordvalues, setRecordvalues] = useState({});
  const [columns, setColumns] = useState([]); // 动态表格
  // const [butdisable, setButDisable] = useState(false);
  // const [sameId, setsameId] = useState('');

  // 缓存页签查询条件
  const [tabrecord, setTabRecord] = useState({});
  const searchrecord = {
    createBy: '',
    workStatus: '',
    examineStatus: '',
    examineBy: '',
    paginations,
    expand,
  };
  let cacheinfo = {};
  cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.createStartTime = values.createStartTime ? moment(values.createStartTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.createEndTime = values.createEndTime ? moment(values.createEndTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.examineStartTime = values.examineStartTime ? moment(values.examineStartTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.examineEndTime = values.examineEndTime ? moment(values.examineEndTime).format('YYYY-MM-DD HH:mm:ss') : '';
    setTabRecord({ ...values });
    dispatch({
      type: 'autosoftwork/findautosoftworkList',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  const handleReset = () => {
    router.push({
      pathname: `/automation/automatedjob/softstartandstop/softexecute`,
      query: { pathpush: true },
      state: { cach: false, }
    });
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

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

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: autosoftworklist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  // 启动
  const torunAutoSoftWork = id => {
    runAutoSoftWork(id).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '启动成功');
      } else {
        message.error(res.msg);
      }
    })
  };

  // 停止
  const tostopAutoSoftWork = id => {
    stopAutoSoftWork(id).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '停止成功');
      } else {
        message.error(res.msg);
      }
    })
  };

  // 结束作业
  const toendAutoSoftWork = id => {
    endAutoSoftWork(id).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '结束作业成功！');
        // setsameId(id);
        // setButDisable(true);
      } else {
        message.error(res.msg);
      }
    })
  };

  // 打开日志抽屉
  const handleShowDrawer = (drwertitle, record) => {
    setVisibledrawer(!visibledrawer);
    setTitledrawer(drwertitle);
    setRecordvalues(record);
  };

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  )

  const initialColumns = [
    {
      title: '启停申请说明',
      dataIndex: 'workRemarks',
      key: 'workRemarks',
      width: 250,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'workStatus',
      key: 'workStatus',
      width: 150,
    },
    {
      title: '启停对象',
      dataIndex: 'softWorkObjectNum',
      key: 'softWorkObjectNum',
      width: 150,
      render: (text, record) => {
        return (
          <TaskWorkObjectModel record={record} dispatch={dispatch} values={getFieldsValue()}>
            <a type="link">{text}</a>
          </TaskWorkObjectModel>
        );
      },
    },
    {
      title: '审核结果',
      dataIndex: 'examineStatus',
      key: 'examineStatus',
      width: 150,
      ellipsis: true,
    },
    {
      title: '申请人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 180,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
    {
      title: '审核人',
      dataIndex: 'examineBy',
      key: 'examineBy',
      width: 120,
    },
    {
      title: '审核时间',
      dataIndex: 'examineTime',
      key: 'examineTime',
      width: 250,
    },
    {
      title: '审核说明',
      dataIndex: 'examineRemarks',
      key: 'examineRemarks',
      width: 250,
      ellipsis: true,
    },
    {
      title: '审核单位',
      dataIndex: 'examineDept',
      key: 'examineDept',
      width: 260,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 260,
      render: (text, record) => {
        return (
          <div>
            <Popconfirm title="是否确定启动软件？" onConfirm={() => torunAutoSoftWork(record.id)}>
              <a type="link"
              // disabled={record.id === sameId ? butdisable : false}
              >
                启动
              </a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否确定停止软件？" onConfirm={() => tostopAutoSoftWork(record.id)}>
              <a type="link"
              // disabled={record.id === sameId ? butdisable : false}
              >
                停止
              </a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否确定结束作业？" onConfirm={() => toendAutoSoftWork(record.id)}>
              <a type="link"
              // disabled={record.id === sameId ? butdisable : false}
              >
                结束作业
              </a>
            </Popconfirm>
            <Divider type="vertical" />
            <a type="link"
              onClick={() => handleShowDrawer('查看执行日志', record)}
            >
              查看日志
            </a>
          </div>
        );
      },
    },
  ];

  // 动态列表名称
  const defaultAllkey = columns.map(item => {
    return item.title;
  });

  // 创建列表
  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map(val => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: 250,
        ellipsis: true,
      };
      if (val.title === '启停对象') {
        obj.render = (text, record) => {
          return (
            <TaskWorkObjectModel record={record} dispatch={dispatch} values={getFieldsValue()}>
              <a type="link">{text}</a>
            </TaskWorkObjectModel>
          )
        }
      }
      if (val.title === '操作') {
        obj.render = (_, record) => {
          return (
            <div>
              <Popconfirm title="是否确定启动软件？" onConfirm={() => torunAutoSoftWork(record.id)}>
                <a type="link"
                // disabled={record.id === sameId ? butdisable : false}
                >
                  启动
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="是否确定停止软件？" onConfirm={() => tostopAutoSoftWork(record.id)}>
                <a type="link"
                // disabled={record.id === sameId ? butdisable : false}
                >
                  停止
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="是否确定结束作业？" onConfirm={() => toendAutoSoftWork(record.id)}>
                <a type="link"
                // disabled={record.id === sameId ? butdisable : false}
                >
                  结束作业
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <a type="link"
                onClick={() => handleShowDrawer('查看执行日志', record)}
              >
                查看日志
              </a>
            </div>
          );
        }
        obj.fixed = 'right'
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
    }
    )
  };

  // 列表设置
  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : [])
  };

  // 列名点击
  const onCheck = (checkedValues) => {
    formThead = initialColumns.filter(i =>
      checkedValues.indexOf(i.title) >= 0
    );

    if (formThead.length === 0) {
      setColumns([]);
    }
    creataColumns();
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
              expand,
            },
            tabid: sessionStorage.getItem('tabid')
          },
        });
      };
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset();
        setExpand(false);
      };
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        const { createStartTime, createEndTime, examineStartTime, examineEndTime } = location.state.cacheinfo;
        setFieldsValue({
          createStartTime: createStartTime ? moment(createStartTime) : '',
          createEndTime: createEndTime ? moment(createEndTime) : '',
          examineStartTime: examineStartTime ? moment(examineStartTime) : '',
          examineEndTime: examineEndTime ? moment(examineEndTime) : '',
        });
        setExpand(location.state.cacheinfo.expand);
        setPageinations({ ...paginations, current, pageSize });
      };
    }
  }, [location.state]);

  useEffect(() => {
    if (cacheinfo !== undefined) {
      const current = location.state?.cacheinfo?.paginations?.current || paginations.current;
      const pageSize = location.state?.cacheinfo?.paginations?.pageSize || paginations.pageSize;
      searchdata(current, pageSize);
    }
    setColumns(initialColumns);
  }, []);

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const statusmap = getTypebyId(1071); // 状态
  const checkresultsmap = getTypebyId(1070); // 审核结果

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid={1066}
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="启停申请人">
                {getFieldDecorator('createBy', {
                  initialValue: cacheinfo.createBy,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="申请时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('createStartTime', {})(
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
                    {getFieldDecorator('createEndTime', {})(
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
            <Col span={8} style={{ display: (expand || (location && location.state && location.state.expand)) ? 'block' : 'none' }}>
              <Form.Item label="状态">
                {getFieldDecorator('workStatus', {
                  initialValue: cacheinfo.workStatus,
                })(<Select placeholder="请选择" allowClear>
                  {statusmap.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: (expand || (location && location.state && location.state.expand)) ? 'block' : 'none' }}>
              <Form.Item label="审核结果">
                {getFieldDecorator('examineStatus', {
                  initialValue: cacheinfo.examineStatus,
                })(<Select placeholder="请选择" allowClear>
                  {checkresultsmap.map(obj => (
                    <Option key={obj.key} value={obj.dict_code}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: (expand || (location && location.state && location.state.expand)) ? 'block' : 'none' }}>
              <Form.Item label="审核人">
                {getFieldDecorator('examineBy', {
                  initialValue: cacheinfo.examineBy,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: (expand || (location && location.state && location.state.expand)) ? 'block' : 'none' }}>
              <Form.Item label="审核时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('examineStartTime', {})(
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
                    {getFieldDecorator('examineEndTime', {})(
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
            {(expand || (location && location.state && location.state.expand)) ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
          </Form>
        </Row>
        {/* 列表设置 */}
        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <p style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={columns.length === initialColumns.length === true}
                  >
                    列表展示
                  </Checkbox>
                </p>
                <Checkbox.Group
                  onChange={onCheck}
                  value={defaultAllkey}
                  defaultValue={columns}
                >
                  {initialColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: 8 }}>
                      <Checkbox
                        value={item.title}
                        key={item.key}
                        checked={columns}
                      >
                        {item.title}
                      </Checkbox>
                    </Col>
                  ))}
                </Checkbox.Group>
              </>
            }
          >
            <Button>
              <Icon type="setting" theme="filled" style={{ fontSize: 14 }} />
            </Button>
          </Popover>
        </div>
        {autosoftworklist.rows && (<Table
          columns={columns.length > 0 ? columns : initialColumns}
          dataSource={autosoftworklist.rows.filter(item => item.workStatus !== '已登记')}
          loading={loading}
          rowKey={r => r.id}
          pagination={pagination}
          scroll={{ x: 1300 }}
        />)}
      </Card>
      {/* 抽屉 */}
      <SoftWorkLogsDrawer
        visibledrawer={visibledrawer}
        ChangeVisibledrawer={newvalue => setVisibledrawer(newvalue)}
        titledrawer={titledrawer}
        recordvalues={recordvalues}
        destroyOnClose
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ autosoftwork, loading }) => ({
    autosoftworklist: autosoftwork.autosoftworklist,
    loading: loading.models.autosoftwork,
  }))(SoftTTExecute),
);