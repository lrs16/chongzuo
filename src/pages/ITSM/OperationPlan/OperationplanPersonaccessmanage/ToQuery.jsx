import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  DatePicker,
  Card,
  Table,
  Popconfirm,
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
// import SysDict from '@/components/SysDict';

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

const { Option } = Select;
const { RangePicker } = DatePicker;

const sexMap = ['男', '女'];
const statusMap = ['已登记', '待审核', '已审核'];
const sexselectmap = [
  { key: '0', title: '男' },
  { key: '1', title: '女' }
];

const checkresultMap = ['通过', '不通过'];

const checkStatus1 = [
  { key: '0', title: '已登记' },
  { key: '1', title: '待审核' },
  { key: '2', title: '已审核' }
];

const checkResult1 = [
  { key: '0', title: '通过' },
  { key: '1', title: '不通过' }
];

function Toregister(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, getFieldsValue, setFieldsValue },
    dispatch,
    location,
    findRegistlist,
    loading,
    userinfo,
  } = props;

  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });

  // 缓存页签查询条件
  const [tabrecord, setTabRecord] = useState({});
  const searchrecord = {
    registNo: '',
    checkStatus: '',
    name: '',
    sex: '',
    phone: '',
    content: '',
    carryTool: '',
    applyUser: '',
    checkResult: '',
    checkContent: '',
    checker: '',
    checkUnit: '',
    paginations,
    expand,
  };
  let cacheinfo = {};
  cacheinfo = location.state && location.state.cacheinfo ? location.state.cacheinfo : searchrecord;

  const columns = [
    {
      title: '进出申请编号',
      dataIndex: 'registNo',
      key: 'registNo',
      width: 200,
      fixed: 'left',
      render: (text, record) => {
        const handleClick = () => {
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
            pathname: `/ITSM/operationplan/personaccessmanage/record`,
            query: {
              record,
              userinfo,
              id: record.id,
              checkStatus: record.checkStatus,
              No: text,
              Id: record.registNo,
            },
            state: {
              dynamicpath: true,
              menuDesc: '人员进出查询详情',
            }
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,

    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: 150,
      render: (text, record) => {
        return <span>{sexMap[record.sex]}</span>;
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 200,
    },
    {
      title: '进出事由',
      dataIndex: 'content',
      key: 'content',
      width: 250,
    },
    {
      title: '计划进入时间',
      dataIndex: 'planInTime',
      key: 'planInTime',
      width: 250,
    },
    {
      title: '计划离开时间',
      dataIndex: 'planOutTime',
      key: 'planOutTime',
      width: 250,
    },
    {
      title: '携带工具',
      dataIndex: 'carryTool',
      key: 'carryTool',
      width: 250,
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      width: 150,
      render: (text, record) => {
        return <span>{statusMap[record.checkStatus]}</span>;
      },
    },
    {
      title: '申请人',
      dataIndex: 'applyUser',
      key: 'applyUser',
      width: 150,
    },
    {
      title: '审核结果',
      dataIndex: 'checkResult',
      key: 'checkResult',
      width: 250,
      render: (text, record) => {
        return <span>{checkresultMap[record.checkResult]}</span>;
      },
    },
    {
      title: '审核说明',
      dataIndex: 'checkContent',
      key: 'checkContent',
      width: 250,
    },
    {
      title: '审核人',
      dataIndex: 'checkUser',
      key: 'checkUser',
      width: 150,
    },
    {
      title: '审核单位',
      dataIndex: 'checkUnit',
      key: 'checkUnit',
      width: 300,
    },
  ];

  const queryItsmuser = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  // 查询请求数据
  const searchdata = (values, page, pageSize) => {
    const newValue = {
      ...values,
      // 计划进入时间
      planInTime1: values.planInTime ? moment(values.planInTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      planInTime2: values.planInTime ? moment(values.planInTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      planInTime: '',
      // 计划离开时间
      planOutTime1: values.planOutTime ? moment(values.planOutTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      planOutTime2: values.planOutTime ? moment(values.planOutTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      planOutTime: '',
      // 申请时间
      applyTime1: values.applyTime ? moment(values.applyTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      applyTime2: values.applyTime ? moment(values.applyTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      applyTime: '',
      // 审核时间
      checkTime1: values.checkTime ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      checkTime2: values.checkTime ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      checkTime: ''
    }
    setTabRecord({ ...newValue });
    dispatch({
      type: 'apply/findRegistList',
      payload: {
        ...newValue,
        pageSize,
        pageIndex: page - 1,
      },
    });
  };

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, 1, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: 1,
      pageSize,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page,
    });
  };

  // 分页
  const pagination = {
    showSizeChanger: true, // 改变条数pageSize
    // pageSize 变化的回调
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: findRegistlist.total,
    // 用于显示数据总量和当前数据顺序
    showTotal: total => `总共 ${total} 条记录`,
    // 页码改变的回调，参数是改变后的页码及每页条数
    onChange: (page) => changePage(page),
  };

  // 查询传数据
  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1
    })
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  // 重置
  const handleReset = () => {
    router.push({
      pathname: `/ITSM/operationplan/personaccessmanage/toquery`,
      query: { pathpush: true },
      state: { cach: false, }
    });
    resetFields();
    searchdata(searchrecord, 1, 15);
    setPaginations({ current: 1, pageSize: 15 });
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
        const {
          planInTime1,
          planInTime2,
          planOutTime1,
          planOutTime2,
          applyTime1,
          applyTime2,
          checkTime1,
          checkTime2,
        } = location.state.cacheinfo;
        setFieldsValue({
          planInTime: planInTime1 ? [moment(planInTime1), moment(planInTime2)] : '',
          checkTime: checkTime1 ? [moment(checkTime1), moment(checkTime2)] : '',
          planOutTime: planOutTime1 ? [moment(planOutTime1), moment(planOutTime2)] : '',
          applyTime: applyTime1
            ? [moment(applyTime1), moment(applyTime2)]
            : '',
        });
        setExpand(location.state.cacheinfo.expand);
        setPaginations({ ...paginations, current, pageSize })
      };
    }
  }, [location.state]);

  // 获取数据
  useEffect(() => {
    queryItsmuser();
    if (cacheinfo !== undefined) {
      const values = getFieldsValue();
      const current = location.state?.cacheinfo?.paginations?.current || paginations.current;
      const pageSize = location.state?.cacheinfo?.paginations?.pageSize || paginations.pageSize;
      searchdata(values, current, pageSize);
    }
    return () => {
      setExpand(false);
    };
  }, []);

  // 下载、导出
  const exportDownload = () => {
    const values = getFieldsValue();
    dispatch({
      type: 'apply/downloadRegistExport',
      payload: {
        ...values,
        // 计划进入时间
        planInTime1: values.planInTime ? moment(values.planInTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        planInTime2: values.planInTime ? moment(values.planInTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        planInTime: '',
        // 计划离开时间
        planOutTime1: values.planOutTime ? moment(values.planOutTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        planOutTime2: values.planOutTime ? moment(values.planOutTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        planOutTime: '',
        // 申请时间
        applyTime1: values.applyTime ? moment(values.applyTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        applyTime2: values.applyTime ? moment(values.applyTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        applyTime: '',
        // 审核时间
        checkTime1: values.checkTime ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime2: values.checkTime ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime: ''
      },
    }).then(res => {
      const filename = `人员进出查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // 设置展开收起
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
    </Button></>)

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
      {/* <SysDict
        typeid="1385513049263181825"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      /> */}
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <>
              <Col span={8}>
                <Form.Item label="进出申请编号">
                  {getFieldDecorator('registNo', {
                    initialValue: cacheinfo.registNo,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核状态">
                  {getFieldDecorator('checkStatus', {
                    initialValue: cacheinfo.checkStatus,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {checkStatus1.map(obj => [
                        <Option key={obj.key} value={obj.key}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </>
            <span style={{ display: (expand || (location && location.state && location.state.expand)) ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: cacheinfo.name,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="性别">
                  {getFieldDecorator('sex', {
                    initialValue: cacheinfo.sex,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {sexselectmap.map(({ key, title }) => [
                        <Option key={key} value={key}>
                          {title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phone', {
                    initialValue: cacheinfo.phone,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="进出事由">
                  {getFieldDecorator('content', {
                    initialValue: cacheinfo.content,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计划进入时间">
                  {getFieldDecorator('planInTime', {
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计划离开时间">
                  {getFieldDecorator('planOutTime', {
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="携带工具">
                  {getFieldDecorator('carryTool', {
                    initialValue: cacheinfo.carryTool,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请人">
                  {getFieldDecorator('applyUser', {
                    initialValue: cacheinfo.applyUser,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请时间">
                  {getFieldDecorator('applyTime', {
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核结果">
                  {getFieldDecorator('checkResult', {
                    initialValue: cacheinfo.checkResult,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {checkResult1.map(({ key, title }) => [
                        <Option key={key} value={key}>
                          {title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核时间">
                  {getFieldDecorator('checkTime', {
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核说明">
                  {getFieldDecorator('checkContent', {
                    initialValue: cacheinfo.checkContent,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人">
                  {getFieldDecorator('checker', {
                    initialValue: cacheinfo.checker,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: (expand || (location && location.state && location.state.expand)) ? 'block' : 'none' }}>
                <Form.Item label="审核单位">
                  {getFieldDecorator('checkUnit', {
                    initialValue: cacheinfo.checkUnit,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
            </span>
            {(expand || (location && location.state && location.state.expand)) ? (<Col span={8} style={{ marginTop: 4, paddingLeft: '8.666667%' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Popconfirm title="确定导出数据？" onConfirm={() => exportDownload()}>
            <Button type="primary">导出数据</Button>
          </Popconfirm>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={findRegistlist.rows}
          scroll={{ x: 1600, y: setTableHeight() }}
          rowKey={r => r.registNo}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ apply, itsmuser, loading }) => ({
    findRegistlist: apply.findRegistlist, // 登记列表
    userinfo: itsmuser.userinfo,
    loading: loading.models.apply,
  }))(Toregister)
);