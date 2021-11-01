import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Card,
  message,
  Row,
  Col,
  Popconfirm,
  Select,
  DatePicker,
  Tabs
} from 'antd';
import SysDict from '@/components/SysDict';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import Statistics from '../Statistics';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

function CreditcardTobe(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, resetFields, setFieldsValue },
    scorecardArr,
    dispatch,
    location,
    loading,
  } = props;
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [tabrecord, setTabRecord] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const [tabActiveKey, setTabActiveKey] = useState('search');

  const searchdata = (values, page, pageSize) => {
    const newValue = {
      ...values,
      beginTime: values.evaluationInterval?.length
        ? moment(values.evaluationInterval[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      endTime: values.evaluationInterval?.length
        ? moment(values.evaluationInterval[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 发生时间
      evaluationInterval: '',
      locked: '0',
    };
    dispatch({
      type: `${pagetitle === '计分卡登记'
        ? 'performanceappraisal/getMycardtobe'
        : 'performanceappraisal/getscorecardlistPage'
        }`,
      payload: {
        ...values,
        beginTime: values.evaluationInterval?.length
          ? moment(values.evaluationInterval[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        endTime: values.evaluationInterval?.length
          ? moment(values.evaluationInterval[1]).format('YYYY-MM-DD HH:mm:ss')
          : '', // 发生时间
        evaluationInterval: '',
        pageNum: page,
        pageSize,
        locked: pagetitle === '计分卡登记' ? '0' : '1',
      },
    });
    setTabRecord({ ...newValue });
  };

  const handlesearch = () => {
    validateFields((err, value) => {
      searchdata(value, 1, 15);
    });
  };

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, paginations.current, paginations.pageSize);
    });
  }, []);

  const handleDelete = id => {
    return dispatch({
      type: 'performanceappraisal/scorecardDel',
      payload: id,
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        searchdata({}, 1, paginations.pageSize);
      } else {
        message.error(res.msg);
      }
    });
  };

  const columns = [
    {
      title: '记分卡编号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 200,
      render: (text, record) => {
        const gotoDetail = () => {
          router.push({
            pathname: '/ITSM/servicequalityassessment/creditcard/creditcardregisterdetail',
            query: {
              Id: record.cardNo,
              paramId: record.id,
              search: pagetitle === '计分卡查询' ? true : '',
            },
            state: {
              dynamicpath: true,
              menuDesc: '记分详情页',
            },
          });
        };
        return (
          <a type="link" onClick={gotoDetail}>
            {text}
          </a>
        );
      },
    },
    {
      title: '服务商',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 150,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 250,
    },
    {
      title: '考核类型',
      dataIndex: 'assessType',
      key: 'assessType',
      width: 150,
    },
    {
      title: '评价计分卡名称',
      dataIndex: 'cardName',
      key: 'cardName',
      width: 200,
    },
    {
      title: '评分细则名称',
      dataIndex: 'scoreName',
      key: 'scoreName',
      width: 200,
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: 150,
    },
    {
      title: '专业部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 150,
    },
    {
      title: '评价开始时间',
      dataIndex: 'beginTime',
      key: 'beginTime',
      width: 180,
    },
    {
      title: '评价结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        if (pagetitle === '计分卡登记') {
          return (
            <span>
              <>
                <Popconfirm title="是否要删除此行？" onConfirm={() => handleDelete(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </>
            </span>
          );
        }
        return null;
      },
    },
  ];

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {},
    });
    resetFields();
    searchdata({}, 1, 15);
  };

  useEffect(() => {
    if (location.state && location.state.reset) {
      handleReset();
      searchdata({}, 1, 15);
    }
  }, [location.state]);

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
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

  const exportDownload = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'performanceappraisal/scorecardExport',
        payload: {
          ...values,
          locked: '0',
          id: selectedKeys.toString(),
          pageNum: paginations.current,
          pageSize: paginations.pageSize,
        },
      }).then(res => {
        const filename = '下载.xls';
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: scorecardArr && scorecardArr.total,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: page => changePage(page),
  };

  const record = {
    cardNo: '',
    cardName: '',
    scoreName: '',
    assessType: '',
    version: '',
    deptName: '',
    cardSeason: '',
    providerName: '',
    contractName: '',
    beginTime: '',
    endTime: '',
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

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
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
        // setExpand(false);
      }
      if (location.state.cacheinfo) {
        const { beginTime, endTime } = location.state.cacheinfo;
        setFieldsValue({
          evaluationInterval: beginTime ? [moment(beginTime), moment(endTime)] : '',
        });
      }
    }
  }, [location.state]);

  const rowSelection = {
    onChange: index => {
      setSelectedKeys([...index]);
    },
  };

  const handleAdd = () => {
    router.push({
      pathname: '/ITSM/servicequalityassessment/creditcard/creditcardregister',
      query: {
        addtab: true,
      },
    });
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const assessmentType = getTypebyTitle('考核类型');

  const tabList = [
    {
      key: 'search',
      tab: '记分卡查询',
    },
    {
      key: 'analysis',
      tab: '服务绩效统计分析',
    },
  ];

  const handleTabChange = key => {
    // tab切换
    setTabActiveKey(key);
  };

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <SysDict
        typeid="576"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {
        tabActiveKey === 'search' && (
          <Card>
          <Row>
            <Form {...formItemLayout}>
              <Col span={8}>
                <Form.Item label="计分卡编号">
                  {getFieldDecorator('cardNo', {
                    initialValue: cacheinfo.cardNo,
                  })(<Input />)}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label="评价计分卡名称">
                  {getFieldDecorator('cardName', {
                    initialValue: cacheinfo.cardName,
                  })(<Input />)}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label="评分细则名称">
                  {getFieldDecorator('scoreName', {
                    initialValue: cacheinfo.scoreName,
                  })(<Input />)}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label="考核类型">
                  {getFieldDecorator('assessType', {
                    initialValue: cacheinfo.assessType,
                  })(
                    <Select placeholder="请选择">
                      {(assessmentType || []).map(obj => [
                        <Option key={obj.dict_code} value={obj.dict_code}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label="版本号">
                  {getFieldDecorator('version', {
                    initialValue: cacheinfo.version,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="专业部门">
                  {getFieldDecorator('deptName', {
                    initialValue: cacheinfo.deptName,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="评价区间">
                  {getFieldDecorator('evaluationInterval', {
                    initialValue: cacheinfo.beginTime
                      ? [moment(cacheinfo.beginTime), moment(cacheinfo.endTime)]
                      : '',
                  })(
                    <RangePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [
                          moment('00:00:00', 'HH:mm:ss'),
                          moment('23:59:59', 'HH:mm:ss'),
                        ],
                      }}
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label="服务商">
                  {getFieldDecorator('providerName', {
                    initialValue: cacheinfo.providerName,
                  })(<Input />)}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label="合同名称">
                  {getFieldDecorator('contractName', {
                    initialValue: cacheinfo.contractName,
                  })(<Input />)}
                </Form.Item>
              </Col>
  
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ marginRight: 8 }} onClick={handlesearch}>
                  查询
                </Button>
  
                <Button onClick={handleReset}>重置</Button>
              </Col>
            </Form>
          </Row>
  
          {pagetitle === '计分卡登记' && (
            <Button type="primary" onClick={handleAdd} style={{ marginRight: 10 }}>
              新建
            </Button>
          )}
  
          <Button type="primary" onClick={exportDownload}>
            导出数据
          </Button>
          <Table
            loading={loading}
            columns={columns}
            dataSource={scorecardArr && scorecardArr.records}
            rowKey={records => records.id}
            scroll={{ x: 1500, y: 700 }}
            rowSelection={rowSelection}
            pagination={pagination}
          />
        </Card>
        )
      }

      {
        tabActiveKey === 'analysis' && (
          <Statistics />
        )
      }
     
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ performanceappraisal, loading }) => ({
    scorecardArr: performanceappraisal.scorecardArr,
    loading: loading.models.performanceappraisal,
  }))(CreditcardTobe),
);
