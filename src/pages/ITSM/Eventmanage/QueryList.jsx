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
  Badge,
  Tag,
  Cascader,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SysDict from '@/components/SysDict';

const { Option } = Select;
const { RangePicker } = DatePicker;
const paramsSearch = 'search';
let empty;
let noStatistic = '';

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
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};
const columns = [
  {
    title: '事件编号',
    dataIndex: 'eventNo',
    key: 'eventNo',
    width: 150,
    fixed: 'left',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/eventmanage/query/details`,
          query: {
            pangekey: record.eventStatus,
            id: record.taskId,
            mainId: record.id,
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
    fixed: 'left',
    width: 200,
  },
  {
    title: '建单时间',
    dataIndex: 'addTime',
    key: 'addTime',
    fixed: 'left',
    width: 200,
  },
  {
    title: '工单状态',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
    fixed: 'left',
    width: 100,
  },
  {
    title: '申报人',
    dataIndex: 'applicationUser',
    key: 'applicationUser',
    fixed: 'left',
    width: 100,
  },
  {
    title: '申报人单位',
    dataIndex: 'applicationUnit',
    key: 'applicationUnit',
    width: 120,
  },
  {
    title: '申报人部门',
    dataIndex: 'applicationDept',
    key: 'applicationDept',
    width: 120,
  },
  {
    title: '事件分类',
    dataIndex: 'eventType',
    key: 'eventType',
    width: 120,
  },
  {
    title: '事件对象',
    dataIndex: 'eventObject',
    key: 'eventObject',
    width: 120,
  },
  // {
  //   title: '标签',
  //   dataIndex: 'eventobject',
  //   key: 'eventobject',
  //   width: 150,
  //   render: (text, record) => {
  //     const tags = ['标签1', '标签2', '标签3'];
  //     return (
  //       <>
  //         {tags.map(obj => (
  //           <Tag color="#108ee9" style={{ margin: 2 }}>
  //             {obj}
  //           </Tag>
  //         ))}
  //       </>
  //     );
  //   },
  // },
  {
    title: '回访方式',
    dataIndex: 'revisitWay',
    key: 'revisitWay',
    width: 120,
  },
  {
    title: '事件来源',
    dataIndex: 'eventSource',
    key: 'eventSource',
    width: 150,
  },
  {
    title: '影响度',
    dataIndex: 'eventEffect',
    key: 'eventEffect',
    width: 80,
  },
  {
    title: '优先级',
    dataIndex: 'eventPrior',
    key: 'eventPrior',
    width: 80,
  },
  {
    title: '紧急度',
    dataIndex: 'eventEmergent',
    key: 'eventEmergent',
    width: 80,
  },
  {
    title: '登记人',
    dataIndex: 'registerUser',
    key: 'register_user',
    width: 80,
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
    width: 200,
  },
];

function QueryList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    location: { query: {
      sign,
      time1,
      time2,
      eventObject,
      selfhandle,
      registerUser,
      handleUnit,
      eventStatus,
      applicationUnit
    } },
    loading,
    list,
    dispatch,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState([]);

  if (sign) {
    noStatistic = 'noStatistic';
  }

  useEffect(() => {
    empty = '';
    noStatistic = '';
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventquery/fetchlist',
          payload: {
            ...values,
            pageIndex: paginations.current - 1,
            pageSize: paginations.pageSize,
            time1: time1 === undefined ? moment().startOf('month').format('YYYY-MM-DD HH:mm:ss') : time1,
            time2: time2 === undefined ? moment().format('YYYY-MM-DD HH:mm:ss') : time1,
            eventObject,
            selfhandle,
            registerUser,
            handleUnit,
            eventStatus,
            applicationUnit
          },
        });
      }
    });
    return () => {
      setSelectData([]);
    };

  }, []);

  //  查询页查询数据把数据统计的数据清空
  const queryFunciton = (values, page, size, params) => {
    empty = 'empty';
    if (noStatistic) {
      if (values.createTime === undefined) {
        dispatch({
          type: 'eventquery/fetchlist',
          payload: {
            ...values,
            eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : eventObject,
            createTime: '',
            pageSize: size,
            pageIndex: page - 1,
            time1: moment(time1).format('YYYY-MM-DD HH:mm:ss'),
            time2: moment(time2).format('YYYY-MM-DD HH:mm:ss'),
            selfhandle: values.selfhandle ? values.selfhandle : selfhandle,
            registerUser: values.registerUser ? values.registerUser : registerUser,
            applicationUnit: values.applicationUnit ? values.applicationUnit : applicationUnit

          },
        });
      } else {
        dispatch({
          type: 'eventquery/fetchlist',
          payload: {
            ...values,
            eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : eventObject,
            createTime: '',
            time1: sign ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            time2: sign ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
            pageSize: size,
            pageIndex: page - 1,
            selfhandle: values.selfhandle ? values.selfhandle : selfhandle,
            registerUser: values.registerUser ? values.registerUser : registerUser,
            applicationUnit: values.applicationUnit ? values.applicationUnit : applicationUnit
          },
        });
      }
    }

    if (noStatistic === '') {
      dispatch({
        type: 'eventquery/fetchlist',
        payload: {
          ...values,
          eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : eventObject,
          createTime: '',
          time1: values.createTime ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
          time2: values.createTime ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
          pageSize: size,
          pageIndex: page - 1,
        },
      });
    }

  }

  //  查询后点击分页不带统计的参数，翻页、变更每页显示条数
  const changePagelist = (values, page, size, params) => {
    if (noStatistic) {
      if (values.createTime === undefined) {
        dispatch({
          type: 'eventquery/fetchlist',
          payload: {
            ...values,
            eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : eventObject,
            createTime: '',
            time1: moment(time1).format('YYYY-MM-DD HH:mm:ss'),
            time2: moment(time2).format('YYYY-MM-DD HH:mm:ss'),
            pageSize: size,
            pageIndex: page - 1,
            selfhandle: values.selfhandle ? values.selfhandle : selfhandle,
            registerUser: values.registerUser ? values.registerUser : registerUser,
            applicationUnit: values.applicationUnit ? values.applicationUnit : applicationUnit

          },
        })
      } else {
        dispatch({
          type: 'eventquery/fetchlist',
          payload: {
            ...values,
            eventObject: values.eventObject ? (values.eventObject).slice(-1)[0] : eventObject,
            createTime: '',
            time1: moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            time2: moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss'),
            pageSize: size,
            pageIndex: page - 1,
            selfhandle: values.selfhandle ? values.selfhandle : selfhandle,
            registerUser: values.registerUser ? values.registerUser : registerUser,
            applicationUnit: values.applicationUnit ? values.applicationUnit : applicationUnit

          },
        });
      }
    }

    if (noStatistic === '') {
      dispatch({
        type: 'eventquery/fetchlist',
        payload: {
          ...values,
          createTime: '',
          time1: values.createTime ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
          time2: values.createTime ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
          pageSize: size,
          pageIndex: page - 1,
        },
      })
    }

  }

  const searchdata = (values, page, size, params) => {
    switch (params) {
      case 'search':
        queryFunciton(values, page, size, params)
        break;
      case undefined:
        changePagelist(values, page, size, params);
        break;
      default:
        break;
    }
  };



  //  下载
  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventtodo/eventdownload',
          payload: { ...values },
        }).then(res => {
          // console.log(res);
          const filename = `下载.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size);
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
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

  const handleSearch = (params) => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize, params);
    });
  };

  const handleReset = () => {
    resetFields();
  };

  const displayRender = label => {
    return label[label.length - 1];
  };

  const getTypebykey = key => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const sourcemap = getTypebykey('486844540120989696'); // 事件来源
  const statusmap = getTypebykey('1356421038388285441'); // 工单状态
  const typemap = getTypebykey('486844495669755904'); // 事件分类
  const objectmap = getTypebykey('482599461999083520'); // 事件对象
  const returnvisit = getTypebykey('486852783895478272'); // 回访方式
  const effectmap = getTypebykey('482610561507393536'); // 影响度
  const emergentmap = getTypebykey('482610561503199232'); // 紧急度
  const priormap = getTypebykey('482610561499004928'); // 优先级
  const checkresultmap = getTypebykey('1356439651098824706'); // 审核结果
  const yesornomap = getTypebykey('1356502855556534273'); // 是否
  const handleresultmap = getTypebykey('486846455059841024'); // 处理结果
  const satisfactionmap = getTypebykey('486855005945462784'); // 满意度

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1354273739344187393"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="事件编号">
                {getFieldDecorator('eventNo', {
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="工单状态">
                {getFieldDecorator('eventStatus', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择">
                    {statusmap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="事件分类">
                    {getFieldDecorator('eventType', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {typemap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件对象">
                    {getFieldDecorator('eventObject', {
                      initialValue: '',
                    })(
                      <Cascader
                        fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                        options={objectmap}
                        placeholder="请选择"
                        expandTrigger="hover"
                        displayRender={displayRender}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="回访方式">
                    {getFieldDecorator('revisitWay', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {returnvisit.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件来源">
                    {getFieldDecorator('eventSource', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {sourcemap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="影响度">
                    {getFieldDecorator('eventEffect', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {effectmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="紧急度">
                    {getFieldDecorator('eventEmergent', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {emergentmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="优先级">
                    {getFieldDecorator('eventPrior', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {priormap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="自行处理">
                    {getFieldDecorator('selfhandle', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {yesornomap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="是否补单">
                    {getFieldDecorator('supplement', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {yesornomap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核结果">
                    {getFieldDecorator('checkResult', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {checkresultmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理结果">
                    {getFieldDecorator('eventResult', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {handleresultmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="满意度">
                    {getFieldDecorator('satisfaction', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {satisfactionmap.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('eventTitle', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>

                <Col span={8} style={{ clear: 'both' }}>
                  <Form.Item label="申报人">
                    {getFieldDecorator('applicationUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="申报人单位">
                    {getFieldDecorator('applicationUnit', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="申报人部门">
                    {getFieldDecorator('applicationDept', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记人单位">
                    {getFieldDecorator('registerUnit', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记人部门">
                    {getFieldDecorator('registerDept', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人">
                    {getFieldDecorator('checkUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人单位">
                    {getFieldDecorator('checkUnit', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人部门">
                    {getFieldDecorator('checkDept', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理人">
                    {getFieldDecorator('handler', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理人单位">
                    {getFieldDecorator('handleUnit', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="处理人部门">
                    {getFieldDecorator('handleDept', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="回访人">
                    {getFieldDecorator('revisitor', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="回访人单位">
                    {getFieldDecorator('revisitUnit', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="回访人部门">
                    {getFieldDecorator('revisitDept', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="建单时间" {...forminladeLayout}>
                    {getFieldDecorator('createTime')(<RangePicker showTime />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Form.Item>
                  <Button type="primary" onClick={() => handleSearch('search')}>
                    查 询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                    重 置
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="link"
                    onClick={() => {
                      setExpand(!expand);
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
                </Form.Item>
              </Col>
            )}
            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={() => handleSearch('search')}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
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
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>
            导出数据
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          scroll={{ x: 1800 }}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ eventquery, loading }) => ({
    list: eventquery.list,
    loading: loading.models.eventquery,
  }))(QueryList),
);
