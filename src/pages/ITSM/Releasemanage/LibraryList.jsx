import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import EditeTable from './components/EditeTable';

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
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};



function LibraryList(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue },
    loading,
    list,
    dispatch,
  } = props;
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  // 查询
  const searchdata = (values, page, size) => {
    dispatch({
      type: 'releasetodo/fetchlist',
      payload: {
        ...values,
        time1: values.time1 === undefined ? '' : moment(values.time1).format('YYYY-MM-DD HH:mm:ss'),
        time2: values.time2 === undefined ? '' : moment(values.time2).format('YYYY-MM-DD HH:mm:ss'),
        eventObject: values.eventObject?.slice(-1)[0],
        pageSize: size,
        pageIndex: page,
      },
    });
  };

  //  下载
  const download = () => {
    const values = getFieldsValue();
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
  };

  const onShowSizeChange = (page, size) => {
    const values = getFieldsValue();
    searchdata(values, page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    searchdata(values, page, paginations.pageSize);
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
    const values = getFieldsValue();
    searchdata(values, paginations.current, paginations.pageSize);
  };

  const handleReset = () => {
    resetFields();
  };

  const handleApproval = () => {
    const newselectds = selectedRecords.filter(item => item.t1 === '版本管理员审批' && item.t2 === '计划发布');
    console.log(newselectds)
  }

  useEffect(() => {
    const values = getFieldsValue();
    searchdata(values, paginations.curren, paginations.pageSize);
  }, []);

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const typemap = getTypebyId('1384055209809940482');       // 发布类型
  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const statumap = getTypebyId('1385066256880635905');       // 处理环节
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型
  const modulamap = getTypebyId('1384430921586839554');  // 模块

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

  const columns = [
    {
      title: '发布编号',
      dataIndex: 'No',
      key: 'No',
    },
    {
      title: '发布来源',
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
      title: '发布状态',
      dataIndex: 't3',
      key: 't3',
    },
    {
      title: '发布结果',
      dataIndex: 't4',
      key: 't4',
    },
    {
      title: '出厂测试登记人',
      dataIndex: 't5',
      key: 't5',
    },
    {
      title: '出厂测试登记时间',
      dataIndex: 't6',
      key: 't6',
    },
  ];

  const expandedRowRender = () => {
    return <EditeTable
      title='发布清单'
      functionmap={functionmap}
      modulamap={modulamap}
      isEdit={false}
      taskName='发布登记'
      mainId={undefined}
    />;
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="发布编号">
                {getFieldDecorator('release7', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布来源">
                {getFieldDecorator('release1', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布状态">
                {getFieldDecorator('release2', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {statumap.map(obj => (
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
                  <Form.Item label="发布类型">
                    {getFieldDecorator('release3', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择" allowClear>
                        {unitmap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="发布结果">
                    {getFieldDecorator('release4', {
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
                  <Form.Item label="出厂测试登记人">
                    {getFieldDecorator('release5', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="出厂测试登记时间" {...forminladeLayout}>
                    {getFieldDecorator('time1', {
                      initialValue: '',
                    })(
                      <DatePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        placeholder="开始时间"
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
                        placeholder="结束时间"
                        format='YYYY-MM-DD HH:mm:ss' />
                    )}
                  </Form.Item>
                </Col>

              </>
            )}
            <Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
          <Button type="primary" onClick={() => handleApproval()} >版本管理员合并审批</Button >
        </div>
        < Table
          loading={loading}
          columns={columns}
          dataSource={list.rows}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.No}
          expandedRowRender={expandedRowRender}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(LibraryList),
);