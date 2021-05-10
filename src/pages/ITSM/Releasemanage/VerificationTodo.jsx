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
    title: '发布编号',
    dataIndex: 'No',
    key: 'No',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/releasemanage/to-do/record`,
          query: {
            taskName: record.t1,
            taskId: record.No,
            mainId: record.No,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '当前处理环节',
    dataIndex: 't1',
    key: 't1',
  },
  {
    title: '发布类型',
    dataIndex: 't2',
    key: 't2',
    width: 200,
  },
  {
    title: '责任单位',
    dataIndex: 't3',
    key: 't3',
  },
  {
    title: '出厂测试登记人',
    dataIndex: 't4',
    key: 't4',
  },
  {
    title: '发送人',
    dataIndex: 't5',
    key: 't5',
  },
  {
    title: '发送时间',
    dataIndex: 't6',
    key: 't6',
  },
];

function VerificationTodo(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    list,
    dispatch,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  useEffect(() => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'releasetodo/fetchlist',
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
    dispatch({
      type: 'eventtodo/fetchlist',
      payload: {
        ...values,
        createTime: '',
        time1: values.createTime === undefined ? '' : moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        time2: values.createTime === undefined ? '' : moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        eventObject: values.eventObject?.slice(-1)[0],
        pageSize: size,
        pageIndex: page - 1,
      },
    });
  };

  //  下载
  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'releasetodo/eventdownload',
          payload: {
            values,
            ids: selectedRowKeys.toString(),
          },
        }).then(res => {
          const filename = `事件待办_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
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

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
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

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId('1384055209809940482');       // 发布类型
  const functionmap = getTypebyId('1384052503909240833');       // 功能类型
  const checkstatusmap = getTypebyId('1390574180168110081');       // 状态

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="发布编号">
                {getFieldDecorator('eventNo', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态">
                {getFieldDecorator('eventStatus', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {checkstatusmap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="功能类型">
                    {getFieldDecorator('functiontype', {
                      initialValue: '',
                    })(
                      <Cascader
                        fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                        options={functionmap}

                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发布类型">
                    {getFieldDecorator('eventSource', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择" allowClear>
                        {typemap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="问题类型">
                    {getFieldDecorator('registerUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={8}>
              <Form.Item style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                  </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>重 置</Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={(_, index) => index.toString()}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(VerificationTodo),
);