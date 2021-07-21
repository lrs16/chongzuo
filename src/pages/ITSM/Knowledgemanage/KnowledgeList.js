import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};



function KnowledgeList(props) {
  const pagetitle = props.route.name;
  const {
    location, loading, list,
    form: { getFieldDecorator, resetFields, getFieldsValue },
    dispatch,
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [expand, setExpand] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const handleSearch = (page, size) => {
    const values = getFieldsValue();
    const statusmap = new Map([
      ['我的知识', '1'],
      ['编辑知识', '2'],
      ['知识审核', '3'],
      ['知识查询', '4'],
    ]);
    dispatch({
      type: 'knowledg/fetchlist',
      payload: {
        ...values,
        pageIndex: page,
        pageSize: size,
        addUserId: (pagetitle === '我的知识' || pagetitle === '知识审核') ? sessionStorage.getItem('userauthorityid') : '',
        tab: statusmap.get(pagetitle),
      },
    });
  }
  const handleReset = () => {
    console.log('重置')
  }
  const download = () => {
    console.log('导出数据')
  }
  const newknowledge = () => {
    router.push({
      pathname: '/ITSM/knowledgemanage/myknowledge/new',
      query: {
        addtab: true,
      }
    })
  }
  const onSelectChange = (RowKeys) => {
    setSelectedRowKeys(RowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
  };
  const onShowSizeChange = (page, size) => {
    handleSearch(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    handleSearch(page, paginations.pageSize);
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

  useEffect(() => {
    handleSearch(1, 15)
  }, []);

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const typemap = getTypebyId('1412301574201413634');         // 知识分类
  const statusmap = getTypebyId('1412301822885892097');       // 知识状态

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

  const columns = [
    {
      title: '知识编号',
      dataIndex: 'no',
      key: 'no',
      fixed: 'left',
      render: (text, record) => {
        const desmap = new Map([
          ['我的知识', '编辑知识'],
          ['知识维护', '编辑知识'],
          ['知识审核', '知识审核'],
          ['知识查询', '知识详情'],
        ]);
        const handleClick = () => {
          router.push({
            pathname: `${location.pathname}/operation`,
            query: {
              Id: record.no,
            },
            state: {
              runpath: location.pathname,
              title: pagetitle,
              dynamicpath: true,
              menuDesc: (record.status === '已登记' || pagetitle === '知识审核') ? desmap.get(pagetitle) : '知识详情',
              status: record.status,
              mainId: record.id
            },
          });
        };
        return <a onClick={handleClick}>{text}</a>;
      },
    },
    {
      title: '知识分类',
      dataIndex: 'type',
      key: 'type',
      width: 180,
    },
    {
      title: '知识标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '知识状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '作者',
      dataIndex: 't5',
      key: 't5',
    },
    {
      title: '发布时间',
      dataIndex: 'addTime',
      key: 'addTime',
    },
    {
      title: '编辑人',
      dataIndex: 'updateUser',
      key: 'updateUser',
    },
    {
      title: '编辑时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '阅读量',
      dataIndex: 'lookNum',
      key: 'lookNum',
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="1412301036722327553"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="知识编号">
                {getFieldDecorator('no', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            {(expand || pagetitle === '知识审核') && (
              <>
                <Col span={8}>
                  <Form.Item label="知识分类">
                    {getFieldDecorator('type', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择" allowClear>
                        {typemap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="登记时间" >
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
                <Col span={8}>
                  <Form.Item label="知识标题">
                    {getFieldDecorator('title', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}
            {pagetitle === '知识查询' && (
              <Col span={8}>
                <Form.Item label="知识状态">
                  {getFieldDecorator('status', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" allowClear>
                      {statusmap.map(obj => (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            )}
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="知识内容">
                    {getFieldDecorator('content', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />,)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="作者">
                    {getFieldDecorator('addUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="编辑人">
                    {getFieldDecorator('updateUser', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                {/* <Col span={8}>
                  <Form.Item label="阅读量">
                    {getFieldDecorator('lookNum', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col> */}
                <Col span={8}>
                  <Form.Item label="编辑时间" >
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('time3', {
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
                        {getFieldDecorator('time4', {
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
              </>
            )}
            <Col span={8} style={{ paddingLeft: '5.55556%', textAlign: 'left', paddingTop: 4 }}>{extra}</Col>
          </Form>
        </Row>

        <div style={{ marginBottom: 24 }}>
          {(pagetitle === '我的知识' || pagetitle === '知识维护') && (
            <>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => newknowledge()}>新增</Button >
              <Button type="primary" style={{ marginRight: 8 }}>提交</Button >
            </>
          )}
          {pagetitle === '知识审核' && (
            <>
              <Button type="primary" style={{ marginRight: 8 }}>审核</Button >
              <Button type="danger" style={{ marginRight: 8 }}>撤销发布</Button >
              <Button type="danger" ghost style={{ marginRight: 8 }}>废止</Button >
            </>
          )}
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
          {(pagetitle === '我的知识' || pagetitle === '知识维护') && (
            <Button type="danger" ghost style={{ marginRight: 8 }}>删除</Button >
          )}
        </div>
        < Table
          loading={loading}
          columns={columns}
          dataSource={list.data}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.no}
          scroll={{ x: 1300 }}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ knowledg, loading }) => ({
    list: knowledg.list,
    loading: loading.models.knowledg,
  }))(KnowledgeList),
);