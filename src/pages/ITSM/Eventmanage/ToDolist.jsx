import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SysDict from '@/components/SysDict';

const { Option } = Select;
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
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

const columns = [
  {
    title: '事件编号',
    dataIndex: 'eventNo',
    key: 'eventNo',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/eventmanage/to-do/record/workorder`,
          query: {
            taskName: record.eventStatus,
            taskId: record.taskId,
            mainId: record.mainId,
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
    title: '事件来源',
    dataIndex: 'eventSource',
    key: 'eventSource',
  },
  {
    title: '事件分类',
    dataIndex: 'eventType',
    key: 'eventType',
  },
  {
    title: '填报人',
    dataIndex: 'registerUser',
    key: 'registerUser',
  },
  // {
  //   title: '处理人',
  //   dataIndex: 'handle_user',
  //   key: 'handle_user',
  // },
  {
    title: '工单状态',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
  },
  {
    title: '发送时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '优先级',
    dataIndex: 'eventPrior',
    key: 'eventPrior',
  },
];

function ToDolist(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    list,
    dispatch,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState([]);

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'eventtodo/fetchlist',
          payload: {
            ...values,
            pageIndex: paginations.current - 1,
            pageSize: paginations.pageSize,
          },
        });
      }
    });
    return () => {
      setSelectData([]);
      setExpand(false);
    };
  }, []);

  // 查询
  const searchdata = (values, page, size) => {
    if (values.createTime === undefined) {
      dispatch({
        type: 'eventtodo/fetchlist',
        payload: {
          ...values,
          eventObject: values.eventObject?.slice(-1)[0],
          pageSize: size,
          pageIndex: page - 1,
        },
      });
    } else {
      dispatch({
        type: 'eventtodo/fetchlist',
        payload: {
          ...values,
          createTime: '',
          time1: moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          time2: moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss'),
          eventObject: values.eventObject?.slice(-1)[0],
          pageSize: size,
          pageIndex: page - 1,
        },
      });
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
          const filename = `${moment().format('YYYY-MM-DD HH:mm')}.xls`;
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

  const handleReset = () => {
    resetFields();
  };

  const getTypebykey = key => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const sourcemap = getTypebykey('486844540120989696'); // 事件来源
  const statusmap = getTypebykey('1356421038388285441'); // 工单状态
  const priormap = getTypebykey('482610561499004928'); // 优先级

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
            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="事件标题">
                    {getFieldDecorator('eventTitle', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="事件来源">
                    {getFieldDecorator('eventSource', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {sourcemap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}
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
                  <Form.Item label="登记人">
                    {getFieldDecorator('registerUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="申报人">
                    {getFieldDecorator('applicationUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="优先级">
                    {getFieldDecorator('eventPrior', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {priormap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="发送时间" {...forminladeLayout}>
                    {getFieldDecorator('createTime')(<RangePicker showTime />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Form.Item>
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
                </Form.Item>
              </Col>
            )}
            {expand === true && (
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
          rowKey={record => record.eventNo}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ eventtodo, loading }) => ({
    list: eventtodo.list,
    loading: loading.models.eventtodo,
  }))(ToDolist),
);
