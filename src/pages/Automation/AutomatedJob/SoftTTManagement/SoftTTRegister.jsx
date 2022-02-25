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
  Divider,
  Popconfirm,
  DatePicker,
  message,
  Icon,
  Popover,
  Checkbox
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import { deleteAutoSoftWorkById } from './services/api';

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

function SoftTTRegister(props) {
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
  const [columns, setColumns] = useState([]); // 动态表格

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

  // 列表请求
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
      pathname: `/automation/automatedjob/softstartandstop/softregister`,
      query: { pathpush: true },
      state: { cach: false, }
    });
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  // 去登记
  const newRegist = (buttype, record) => {
    if (buttype === 'edit') {
      router.push({
        pathname: '/automation/automatedjob/softstartandstop/softregister/newregist',
        query: {
          Id: record.id,
          buttype: 'edit'
        },
        state: {
          dynamicpath: true,
          menuDesc: '编辑启停登记',
        }
      })
    } else {
      router.push({
        pathname: '/automation/automatedjob/softstartandstop/softregister/newregist',
        query: {
          addtab: true,
          menuDesc: '启停登记',
          buttype: 'add'
        },
      })
    }
  }

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

  // 查询
  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  // 删除
  const handleDelete = id => {
    deleteAutoSoftWorkById(id).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '删除成功');
        searchdata(1, 15);
      } else {
        message.error(res.msg);
      }
    });
  }

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

  // 列表
  const initialColumns = [
    {
      title: '启停申请说明',
      dataIndex: 'workRemarks',
      key: 'workRemarks',
      width: 250,
      render: (text, record) => {
        const handledetailClick = () => {
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
          router.push({
            pathname: '/automation/automatedjob/softstartandstop/softregister/details',
            query: {
              Id: record.id,
              workId: record.id,
              buttype: 'detailsview'
            },
            state: {
              runpath: location.pathname,
              title: pagetitle,
              dynamicpath: true,
              menuDesc: '启停登记详情',
              status: record.workStatus,
            },
          });
        };
        return <a onClick={handledetailClick}>{text}</a>;
      },
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
    },
    {
      title: '审核结果',
      dataIndex: 'examineStatus',
      key: 'examineStatus',
      width: 150,
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
    },
    {
      title: '审核单位',
      dataIndex: 'examineDept',
      key: 'examineDept',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            {(record.workStatus === '已审核' && record.examineStatus === '通过') ? <a type="link" disabled
            >
              编辑
            </a> : <a type="link"
              onClick={() => newRegist('edit', record)}
            >
              编辑
            </a>}
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link"
                style={{ color: 'red' }}
              >
                删除
              </a>
            </Popconfirm>
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
      if (val.title === '启停申请说明') {
        obj.render = (text, record) => {
          const handledetailClick = () => {
            router.push({
              pathname: '/automation/automatedjob/softstartandstop/softregister/details',
              query: {
                Id: record.id,
                workId: record.id,
                buttype: 'detailsview'
              },
              state: {
                runpath: location.pathname,
                title: pagetitle,
                dynamicpath: true,
                menuDesc: '启停登记详情',
                status: record.workStatus,
              },
            });
          };
          return <a onClick={handledetailClick}>{text}</a>;
        }
      }
      if (val.title === '操作') {
        obj.render = (_, record) => {
          return (
            <div>
              {(record.workStatus === '已审核' && record.examineStatus === '通过') ? <a type="link" disabled
              >
                编辑
              </a> : <a type="link"
                onClick={() => newRegist('edit', record)}
              >
                编辑
              </a>}
              <Divider type="vertical" />
              <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
                <a type="link"
                  style={{ color: 'red' }}
                >
                  删除
                </a>
              </Popconfirm>
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

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 568
      } else {
        height = clientHeight - 510
      }
    }
    return height;
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid={1066}
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card bodyStyle={{ paddingBottom: 0 }}>
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
                  initialValue: cacheinfo.workStatus || '1',
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
        <div style={{ marginBottom: 8 }}>
          <Button type="primary" style={{ marginRight: 8 }}
            onClick={() => newRegist('add')}
          >登记</Button>
        </div>
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
        <Table
          columns={initialColumns && initialColumns.length > 0 ? initialColumns : columns}
          dataSource={autosoftworklist.rows}
          loading={loading}
          rowKey={r => r.id}
          pagination={pagination}
          scroll={{ x: 1300, y: setTableHeight() }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ autosoftwork, loading }) => ({
    autosoftworklist: autosoftwork.autosoftworklist,
    loading: loading.models.autosoftwork,
  }))(SoftTTRegister),
);