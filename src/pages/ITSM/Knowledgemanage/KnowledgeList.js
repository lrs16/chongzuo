import React, { useState } from 'react';
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
    form: { getFieldDecorator, resetFields, getFieldsValue },
    dispatch,
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [expand, setExpand] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSearch = () => {
    console.log('查询')
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
      dataIndex: 'No',
      key: 'No',
    },
    {
      title: '知识分类',
      dataIndex: 't1',
      key: 't1',
    },
    {
      title: '知识标题',
      dataIndex: 't2',
      key: 't2',
      width: 200,
    },
    {
      title: '知识内容',
      dataIndex: 't3',
      key: 't3',
    },
    {
      title: '知识状态',
      dataIndex: 't4',
      key: 't4',
    },
    {
      title: '作者',
      dataIndex: 't5',
      key: 't5',
    },
    {
      title: '发布时间',
      dataIndex: 't6',
      key: 't6',
    },
    {
      title: '编辑人',
      dataIndex: 't7',
      key: 't7',
    },
    {
      title: '编辑时间',
      dataIndex: 't8',
      key: 't8',
    },
    {
      title: '阅读量',
      dataIndex: 't9',
      key: 't9',
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
                {getFieldDecorator('form1', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="知识分类">
                    {getFieldDecorator('form2', {
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
                  <Form.Item label="发布时间" >
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('form3', {
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
                    {getFieldDecorator('form4', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={8}>
              <Form.Item label="知识状态">
                {getFieldDecorator('form5', {
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
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="知识内容">
                    {getFieldDecorator('form6', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />,)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="作者">
                    {getFieldDecorator('form7', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="编辑人">
                    {getFieldDecorator('form8', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="阅读量">
                    {getFieldDecorator('form9', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

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
              <Button type="primary" style={{ marginRight: 8 }}>编辑</Button >
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
          //  loading={loading}
          columns={columns}
          //  dataSource={list.rows}
          //  pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.No}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(KnowledgeList),
);