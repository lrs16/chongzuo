import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Cascader } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;
const { RangePicker } = DatePicker;

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

const form10ladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const columns = [
  {
    title: '需求编号',
    dataIndex: 'demandId',
    key: 'demandId',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/demandmanage/query/details`,
          query: {
            taskId: record.taskId,
            mainId: record.processInstanceId,
            taskName: record.taskName,
            No: text,
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
    with: 200,
  },
  {
    title: '需求类型',
    dataIndex: 'demandType',
    key: 'demandType',
  },
  {
    title: '申请人',
    dataIndex: 'proposer',
    key: 'proposer',
  },
  {
    title: '工单状态',
    dataIndex: 'taskName',
    key: 'taskName',
  },

  {
    title: '登记人',
    dataIndex: 'sender',
    key: 'sender',
  },
  {
    title: '建单时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    render: text => {
      return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
  },
];

function QueryList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue, getFieldsValue },
    location: { query: { module, taskName, startTime, endTime, completeStatus } },
    loading,
    list,
    dispatch,
    location,
  } = props;
  let title;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');


  const searchdata = (values, page, size) => {
    dispatch({
      type: 'demandquery/querylist',
      payload: {
        ...values,
        limit: size,
        page,
        // module,
        completeStatus: values.completeStatus === undefined ? '' : values.completeStatus,
        module: values.module.slice(-1)[0],
        startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    });
  };


  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, 0, 15)
      }
    });
  }, [location]);

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

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, 0, paginations.pageSize);
    });
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
  };

  const download = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'demandquery/download',
        payload: {
          ...values,
          startTime: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        }
      }).then(res => {
        const filename = `需求查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    })
  };

  const time = startTime ? [moment(startTime), moment(endTime)] : '';
  const modulestatus = module === undefined ? [] : [module];

  // 打开多页签，表单信息传回tab
  // useEffect(() => {
  //   if (location.state.cache) {
  //     const values = getFieldsValue();
  //     dispatch({
  //       type: 'viewcache/gettabstate',
  //       payload: {
  //         cacheinfo: {
  //           ...values,
  //           page: paginations.current,
  //           limit: paginations.pageSize,
  //           module,
  //           taskName,
  //           startTime: startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
  //           endTime: endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : '',
  //           completeStatus,
  //         },
  //         tabid: sessionStorage.getItem('tabid')
  //       },
  //     });
  //   }
  // }, [location.state]);

  // const cacheinfo = location.state.cacheinfo === undefined ? {} : location.state.cacheinfo;

  const cacheinfo = {}

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  console.log(completeStatus)

  const overtimemap = getTypebyId('1398105664881954817');       // 超时状态
  const demandtype = getTypebyId('1352069854860939266');
  const statemap = getTypebyId('1398105664881954817');
  const modulemap = getTypebyId('1352070663392727041');

  return (
    <PageHeaderWrapper title={title}>
      <DictLower
        typeid="1354274450639425537"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="需求编号">
                {getFieldDecorator('demandId', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('taskName', { initialValue: taskName })(
                  <Select placeholder="请选择" allowClear>
                    {statemap.map(({ key, value }) => (
                      <Option key={key} value={value}>
                        {value}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="功能模块" >
                {getFieldDecorator('module', {
                  initialValue: modulestatus,
                })(
                  <Cascader
                    fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                    options={modulemap}
                  />,
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="需求标题">
                    {getFieldDecorator('demandTitle', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="需求类型">
                    {getFieldDecorator('demandType', { initialValue: cacheinfo.demandType })(
                      <Select placeholder="请选择" allowClear>
                        {demandtype.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerPerson', {
                      initialValue: cacheinfo.registerPerson,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {(startTime || module || completeStatus || expand) && (
              <>
                <Col span={8}>
                  <Form.Item label="超时状态">
                    {getFieldDecorator('completeStatus', { initialValue: completeStatus })(
                      <Select placeholder="请选择" allowClear>
                        {overtimemap.map((obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ]))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="建单时间" {...form10ladeLayout}>
                    {getFieldDecorator('createTime', {
                      initialValue: time,
                    })(<RangePicker
                      showTime
                      format='YYYY-MM-DD'
                      allowClear
                    />)}
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleSearch}>
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
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ demandquery, loading }) => ({
    list: demandquery.list,
    loading: loading.models.demandquery,
  }))(QueryList),
);
