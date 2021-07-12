import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Radio, Row, Col, Card, Tabs, Table, Form, Input, Button, DatePicker, Spin } from 'antd';
import { ChartCard } from '@/components/Charts';
import Donut from '@/components/CustomizeCharts/Donut';
import styles from './index.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

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

const eventtabmap = new Map([
  ['', 1],
  ['全部待办', 1],
  ['待审核待办', 2],
  ['待处理待办', 3],
  ['待回访待办', 4],
  ['已超时待办', 5],
]);

const tabsmap = [
  { key: 'event', tab: '事件单' },
  { key: 'fault', tab: '故障单' },
  { key: 'problem', tab: '问题单' },
  { key: 'demand', tab: '需求单' },
  // { key: '4', tab: '发布单' },
];

const demandtabs = [
  { key: 'd0', name: '全部待办', data: 0 },
  { key: 'd1', name: '待业务科室领导审核', data: 0 },
  { key: 'd2', name: '待系统开发商审核', data: 0 },
  { key: 'd3', name: '待自动化科审核', data: 0 },
  { key: 'd4', name: '待科室领导审核', data: 0 },
  { key: 'd5', name: '待市场部领导审核', data: 0 },
  { key: 'd6', name: '待系统开发商处理', data: 0 },
  { key: 'd7', name: '待自动化业务负责人确认', data: 0 },
  { key: 'd8', name: '待需求登记人员确认', data: 0 },
];

// 饼图数据
const Donutdata = [
  {
    type: '事件单',
    count: 600,
  },
  {
    type: '故障单',
    count: 200,
  },
  {
    type: '问题单',
    count: 100,
  },
  {
    type: '需求单',
    count: 111,
  },
  {
    type: '发布单',
    count: 150,
  },
];

const eventcolumns = [
  {
    title: '工单号',
    dataIndex: 'eventNo',
    key: 'eventNo',
    width: 150,
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/eventmanage/to-do/record/workorder`,
          query: {
            taskName: record.eventStatus,
            taskId: record.taskId,
            mainId: record.mainId,
            check: record.checkResult,
            orderNo: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '事件标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '事件描述',
    dataIndex: 'content',
    key: 'content',
    width: 200,
  },
  {
    title: '申报人',
    dataIndex: 'applicationUser',
    key: 'applicationUser',
    width: 120,
  },
  {
    title: '当前环节',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
    width: 120,
  },
  {
    title: '登记人',
    dataIndex: 'registerUser',
    key: 'registerUser',
    width: 120,
  },
  {
    title: '登记时间',
    dataIndex: 'addTime',
    key: 'addTime',
    width: 200,
  },
  {
    title: '优先级',
    dataIndex: 'eventPrior',
    key: 'eventPrior',
    width: 120,
  },
  // {
  //   title: '超时信息',
  //   dataIndex: 'overtime',
  //   key: 'overtime',
  //   width: 120,
  // },
];
const troublecolumns = [
  {
    title: '工单号',
    dataIndex: 'no',
    key: 'no',
    width: 200,
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/faultmanage/todolist/record`,
          query: {
            id: record.id,
            mainId: record.mainId,
            orderNo: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '故障名称',
    dataIndex: 'title',
    key: 'title',
    width: 150,
  },
  {
    title: '故障概要',
    dataIndex: 'content',
    key: 'content',
    width: 200,
  },
  {
    title: '当前环节',
    dataIndex: 'currentNode',
    key: 'currentNode',
  },
  {
    title: '登记人',
    dataIndex: 'registerUser',
    key: 'registerUser',
  },
  {
    title: '登记时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '严重程度',
    dataIndex: 'registerLevel',
    key: 'registerLevel',
  },
];
const problemcolumns = [
  {
    title: '工单号',
    dataIndex: 'no',
    key: 'no',
    width: 200,
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/problemmanage/besolveddetail/workorder`,
          query: {
            id: record.id,
            taskName: record.currentNode,
            mainId: record.mainId,
            orderNo: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '问题标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '问题描述',
    dataIndex: 'content',
    key: 'content',
    width: 150,
  },
  {
    title: '当前环节',
    dataIndex: 'currentNode',
    key: 'currentNode',
  },
  {
    title: '登记人',
    dataIndex: 'registerUser',
    key: 'registerUser',
  },
  {
    title: '登记时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '重要程度',
    dataIndex: 'importance',
    key: 'importance',
  },
];
const demandcolumns = [
  {
    title: '工单号',
    dataIndex: 'demandId',
    key: 'demandId',
    width: 150,
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/demandmanage/to-do/record/workorder`,
          query: {
            taskName: record.taskName,
            taskId: record.taskId,
            mainId: record.processInstanceId,
            result: '1',
            orderNo: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },

  {
    title: '需求标题',
    dataIndex: 'demandTitle',
    key: 'demandTitle',
    width: 200,
  },
  {
    title: '申请原因',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: '申请人',
    dataIndex: 'proposer',
    key: 'proposer',
    width: 120,
  },
  {
    title: '当前环节',
    dataIndex: 'taskName',
    key: 'taskName',
    width: 200,
  },
  {
    title: '登记人',
    dataIndex: 'sender',
    key: 'sender',
    width: 120,
  },
  {
    title: '登记时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    width: 200,
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    width: 120,
  },
];

function ITHomePage(props) {
  const {
    dispatch,
    eventloading,
    faultloading,
    problemloading,
    demandloading,
    eventlist,
    faultlist,
    problemlist,
    demandlist,
    form: { getFieldDecorator, resetFields, validateFields },
  } = props;
  const [ordertype, setOrderType] = useState('event'); // 工单类型
  const [tabskeys, setTabsKeys] = useState([]); // 节点tabs
  const [activeKey, setActiveKey] = useState('全部待办'); // 当前节点tabk
  const [tablecolumns, setTableColumns] = useState(eventcolumns);
  const [tabledata, setTableData] = useState([]);
  const [tabletotal, setTableTotal] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  const searchdata = (value, page, size, key, tabkey) => {
    switch (key) {
      case 'event': {
        const values = {
          eventNo: value.No,
          applicationUser: value.name,
          time1: value.tim1 ? moment(value.time1).format('YYYY-MM-DD HH:mm:ss') : '',
          time2: value.time2 ? moment(value.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        };
        // 加载列表
        dispatch({
          type: 'ithomepage/fetchlist',
          payload: {
            ...values,
            tab: eventtabmap.get(tabkey),
            pageSize: size,
            pageIndex: page - 1,
          },
        });
        // 加载节点tab
        dispatch({
          type: 'ithomepage/geteventtabs',
          payload: {
            ...values,
          },
        }).then(res => {
          if (res.code === 200) {
            const data = Object.keys(res.data).map(objkey => ({
              name: objkey,
              data: res.data[objkey],
            }));
            setTabsKeys(data);
          }
        });
        break;
      }
      case 'fault': {
        const values = {
          currentNode: tabkey === '全部待办' ? '' : tabkey,
          no: value.No,
          applicationUser: value.name,
          createTimeBegin: value.tim1 ? moment(value.time1).format('YYYY-MM-DD HH:mm:ss') : '',
          createTimeEnd: value.tim2 ? moment(value.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        };
        dispatch({
          type: 'fault/getSearchfaultTodo',
          payload: {
            ...values,
            pageNum: page,
            pageSize: size,
          },
        });
        dispatch({
          type: 'ithomepage/gettroubletabs',
          payload: {
            pageNum: 1,
            pageSize: 20,
          },
        }).then(res => {
          if (res.code === 200) {
            const data = Object.keys(res.data).map(objkey => ({
              name: objkey,
              data: res.data[objkey],
            }));
            setTabsKeys(data);
          }
        });
        break;
      }
      case 'problem': {
        const values = {
          ...value,
          currentNode: tabkey === '全部待办' ? '' : tabkey,
          no: value.No,
          createTimeBegin: value.tim1 ? moment(value.time1).format('YYYY-MM-DD HH:mm:ss') : '',
          createTimeEnd: value.tim2 ? moment(value.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        };
        dispatch({
          type: 'problemmanage/searchBesolve',
          payload: {
            ...values,
            pageNum: page,
            pageSize: size,
          },
        });
        dispatch({
          type: 'ithomepage/getproblemtabs',
          payload: {
            pageNum: 1,
            pageSize: 10,
          },
        }).then(res => {
          if (res.code === 200) {
            const data = Object.keys(res.data).map(objkey => ({
              name: objkey,
              data: res.data[objkey],
            }));
            setTabsKeys(data);
          }
        });
        break;
      }
      case 'demand': {
        const values = {
          taskName: tabkey === '全部待办' ? '' : tabkey,
          demandId: value.No,
          registerPerson: value.name,
          creationTime: '',
          creationStartTime: value.tim1 ? moment(value.time1).format('YYYY-MM-DD HH:mm:ss') : '',
          creationEndTime: value.tim2 ? moment(value.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        };
        dispatch({
          type: 'demandtodo/fetchlist',
          payload: {
            ...values,
            page,
            limit: size,
            userId: sessionStorage.getItem('userauthorityid'),
          },
        });
        dispatch({
          type: 'ithomepage/getdemandtabs',
          payload: {
            userId: sessionStorage.getItem('userauthorityid'),
          },
        }).then(res => {
          if (res.code === 200) {
            const data = Object.keys(res.data).map(objkey => ({
              name: objkey,
              data: res.data[objkey],
            }));
            setTabsKeys(data);
          }
        });
        break;
      }
      default:
        break;
    }
  };

  const handleReset = () => {
    resetFields();
  };

  const handleTabs = key => {
    handleReset();
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, 1, 10, key, '');
      }
    });
    setTabsKeys([]);
    setOrderType(key);
    switch (key) {
      case 'event':
        setTableColumns(eventcolumns);
        break;
      case 'fault':
        setTableColumns(troublecolumns);
        break;
      case 'problem':
        setTableColumns(problemcolumns);
        break;
      case 'demand':
        setTabsKeys(demandtabs);
        setTableColumns(demandcolumns);
        break;
      default:
        break;
    };
    setActiveKey('全部待办')
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize, ordertype, '');
      }
    });
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size, ordertype, '');
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: tabletotal,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize, ordertype, activeKey);
    });
  };

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'ithomepage/fetchlist',
          payload: {
            //  eventNo: values.No,
            tab: 1,
            pageIndex: 0,
            pageSize: paginations.pageSize,
          },
        });
        dispatch({
          type: 'ithomepage/geteventtabs',
          payload: {
            ...values,
          },
        }).then(res => {
          if (res.code === 200) {
            const data = Object.keys(res.data).map(objkey => ({
              name: objkey,
              data: res.data[objkey],
            }));
            setTabsKeys(data);
          }
        });
      }
    });
    return () => {
      setTableData('');
    };
  }, []);

  // 更新表格数据
  // 事件
  useEffect(() => {
    setTableData(eventlist.rows);
    setTableTotal(eventlist.total);
  }, [eventloading, eventlist]);
  // 故障
  useEffect(() => {
    setTableData(faultlist.rows);
    setTableTotal(faultlist.total);
  }, [faultloading, faultlist]);
  // 问题
  useEffect(() => {
    setTableData(problemlist.rows);
    setTableTotal(problemlist.total);
  }, [problemloading, problemlist]);
  // 需求
  useEffect(() => {
    setTableData(demandlist.rows);
    setTableTotal(demandlist.total);
  }, [demandloading, demandlist]);

  function callback(key) {
    setActiveKey(key);
    resetFields();
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, 1, 10, ordertype, key);
      }
    });
  }

  return (
    <>
      <h3>
        <span>关键指标</span>
        <Radio.Group defaultValue="a" style={{ float: 'right' }}>
          <Radio.Button value="a">本日</Radio.Button>
          <Radio.Button value="b">本周</Radio.Button>
          <Radio.Button value="c">本月</Radio.Button>
        </Radio.Group>
      </h3>
      <Row gutter={16}>
        <Col span={12}>
          <ChartCard title="工单量">
            <Donut data={Donutdata} height={250} total="1161" padding={[0, 0, 0, 0]} />
          </ChartCard>
        </Col>
        <Col span={6}>
          <ChartCard title="事件工单情况" style={{ height: 315 }} />
        </Col>
        <Col span={6}>
          <ChartCard title="功能使用情况排名" style={{ height: 315 }} />
        </Col>
      </Row>
      <h3 style={{ paddingTop: 12, paddingBottom: 6 }}>我的工作台</h3>
      <Card tabList={tabsmap} onTabChange={handleTabs} className={styles.home}>
        <div style={{ width: '100%', paddingLeft: '48%' }} > <Spin spinning={tabskeys.length === 0} style={{ marginTop: 12 }} /></div>
        <Tabs activeKey={activeKey} onChange={callback}>
          {tabskeys.map(obj => [
            <TabPane
              tab={
                <>
                  <span>{obj.name}</span>
                  <span style={{ color: '#ff0000' }}>（{obj.data}）</span>
                </>
              }
              key={obj.name}
            />,
          ])}
        </Tabs>
        <Row gutter={24} style={{ margin: '0 0 0 24px' }}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={6}>
              <Form.Item label="工单编号">
                {getFieldDecorator('No', {
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            {(ordertype === 'event' || ordertype === 'demand') && (
              <Col span={6}>
                <Form.Item label="申请人">
                  {getFieldDecorator('name', {
                    initialValue: '',
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item label="登记时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time1', {
                      initialValue: '',
                    })(
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
                    {getFieldDecorator('time2', {
                      initialValue: '',
                    })(
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
            <Col span={4} style={{ paddingTop: 4 }}>
              <Button type="primary" onClick={handleSearch}>
                查 询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                重 置
              </Button>
            </Col>
          </Form>
        </Row>
        <div style={{ padding: '0 24px' }}>
          <Table
            style={{ marginTop: '-16px' }}
            loading={!!eventloading || !!faultloading || !!problemloading || !!demandloading}
            columns={tablecolumns}
            dataSource={tabledata}
            rowKey={(_, index) => index.toString()}
            pagination={pagination}
            scroll={{ x: 1200 }}
          />
        </div>
      </Card>
    </>
  );
}

export default Form.create({})(
  connect(({ ithomepage, fault, problemmanage, demandtodo, loading }) => ({
    eventlist: ithomepage.list,
    faultlist: fault.faultTodoList,
    problemlist: problemmanage.besolveList,
    demandlist: demandtodo.list,
    eventloading: loading.effects['ithomepage/fetchlist'],
    eventtabloading: loading.effects['ithomepage/geteventtabs'],
    faultloading: loading.models.fault,
    problemloading: loading.models.problemmanage,
    demandloading: loading.models.demandtodo,
  }))(ITHomePage),
);
