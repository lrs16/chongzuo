import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, DatePicker, Button, Table, List } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

// const { RangePicker } = DatePicker;
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

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const tabList = [
  {
    key: 'remind',
    tab: '即将超时',
  },
  {
    key: 'notHandle',
    tab: '已超时未处理',
  },
  {
    key: 'timeout',
    tab: '超时已处理',
  },
];

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
            orderNo: text,
            No: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '申报人',
    dataIndex: 'applicationUser',
    key: 'applicationUser',
  },
  {
    title: '事件标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '当前环节',
    dataIndex: 'flowNodeName',
    key: 'flowNodeName',
  },
  {
    title: '当前处理人',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '超时时间',
    dataIndex: 'timeoutTime',
    key: 'timeoutTime',
  },
];

const timeoutcolumns = [
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
            No: text,
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
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
    ellipsis: true,
    width: 120,
    render: (text) => {
      if (text !== null && text.indexOf(';') !== -1) {
        const arr = text.substr(0, text.length - 1).split(';');
        return (
          <List
            size="small"
            style={{ margin: '-16px', }}
            dataSource={arr}
            renderItem={item => <List.Item style={{ padding: '16px' }}>{item}</List.Item>}
          />
        );
      }
      return text
    },
  },
  {
    title: '处理人单位',
    dataIndex: 'handleUnit',
    key: 'handleUnit',
    ellipsis: true,
    width: 350,
    render: (text) => {
      if (text !== null && text.indexOf(';') !== -1) {
        const arr = text.substr(0, text.length - 1).split(';');
        return (
          <List
            size="small"
            style={{ margin: '-16px', }}
            dataSource={arr}
            renderItem={item => <List.Item style={{ padding: '16px' }}>{item}</List.Item>}
          />
        );
      }
      return text
    },
  },
  {
    title: '处理人部门',
    dataIndex: 'handleDept',
    key: 'handleDept',
    ellipsis: true,
    width: 350,
    render: (text) => {
      if (text !== null && text.indexOf(';') !== -1) {
        const arr = text.substr(0, text.length - 1).split(';');
        return (
          <List
            size="small"
            style={{ margin: '-16px', }}
            dataSource={arr}
            renderItem={item => <List.Item style={{ padding: '16px' }}>{item}</List.Item>}
          />
        );
      }
      return text
    },
  },
  {
    title: '事件对象',
    dataIndex: 'eventObject',
    key: 'eventObject',
    with: 10,
  },
  {
    title: '超时原因',
    dataIndex: 'timeoutMsg',
    key: 'timeoutMsg',
  },

];

function Overtime(props) {
  const pagetitle = props.route.name;
  const { dispatch, list, loading } = props;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const [tabActivekey, settabActivekey] = useState('notHandle'); // 打开标签
  const [tablecolumn, setTableColumn] = useState(columns); // 打开标签
  const [expand, setExpand] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const getdatas = tabkey => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventtimeout/query',
          payload: {
            ...values,
            tabType: tabkey,
            time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
            time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
            pageIndex: paginations.current - 1,
            pageSize: paginations.pageSize,
          },
        });
      }
    })
  };

  useEffect(() => {
    getdatas('notHandle');
  }, []);

  const handleTabChange = key => {
    switch (key) {
      case 'remind':
        settabActivekey('remind');
        setTableColumn(columns);
        break;
      case 'notHandle':
        settabActivekey('notHandle');
        setTableColumn(columns);
        break;
      case 'timeout':
        settabActivekey('timeout');
        setTableColumn(timeoutcolumns);
        break;
      default:
        break;
    }
    getdatas(key);
    resetFields();
  };

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'eventtimeout/query',
      payload: {
        ...values,
        time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        tabType: tabActivekey,
        pageIndex: page - 1,
        pageSize: size,
      },
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

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  const download = () => {
    validateFields((_, values) => {
      dispatch({
        type: 'eventtimeout/download',
        payload: {
          tabType: tabActivekey,
          ...values,
          time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
          time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        },
      }).then(res => {
        const filename = `事件超时查询${moment().format('YYYY-MM-DD HH:mm')}.xls`;
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    })
  };

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <Col span={6}>
              <Form.Item label="事件编号">
                {getFieldDecorator('eventNo', {
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="当前环节">
                {getFieldDecorator('flowNodeName', {
                  initialValue: '',
                })(
                  <Select>
                    <Option value="事件登记">事件登记</Option>
                    <Option value="事件审核">事件审核</Option>
                    <Option value="事件处理">事件处理</Option>
                    <Option value="事件确认">事件确认</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="建单时间" {...forminladeLayout}>
                {getFieldDecorator('time1', {
                  initialValue: '',
                })(
                  <DatePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: moment('00:00:00', 'HH:mm:ss'),
                    }}
                    format='YYYY-MM-DD HH:mm:ss' />
                )}
                <span style={{ padding: '0 10px' }}>-</span>
                {getFieldDecorator('time2', {
                  initialValue: '',
                })(
                  <DatePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: moment('23:59:59', 'HH:mm:ss'),
                    }}
                    format='YYYY-MM-DD HH:mm:ss' />
                )}
              </Form.Item>
            </Col>
            {expand === true && (
              <>
                <Col span={6}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('eventTitle', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="当前处理人">
                    {getFieldDecorator('userName', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>

              </>
            )}
            <Col span={24} style={{ textAlign: 'right', marginBottom: 8 }}>
              <Button type="primary" onClick={handleSearch}>
                查 询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => resetFields()}>
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
          <Button
            type="primary"
            onClick={() => download()}
          >
            导出数据
          </Button>
        </div>
        <Table
          columns={tablecolumn}
          dataSource={list.rows}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1400 }}
          bordered={tabActivekey === 'timeout'}
          size={tabActivekey === 'timeout' ? 'middle' : 'default'}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ eventtimeout, loading }) => ({
    list: eventtimeout.list,
    loading: loading.models.eventtimeout,
  }))(Overtime),
);
