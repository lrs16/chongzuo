import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Select, Button, Table, Cascader, Tooltip, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;

const InputGroup = Input.Group;

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

function Checktodo(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    checklist,
    checktotals,
    dispatch,
    viewlist,
    viewmsg,
    viewloading,
    location
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
          type: 'releaseverificat/fetchchecklist',
          payload: {
            ...values,
            pageIndex: paginations.current,
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
      type: 'releaseverificat/fetchchecklist',
      payload: {
        ...values,
        createTime: '',
        time1: values.createTime === undefined ? '' : moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        time2: values.createTime === undefined ? '' : moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        eventObject: values.eventObject?.slice(-1)[0],
        pageSize: size,
        pageIndex: page,
      },
    });
  };

  //  下载
  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'releaseverificat/fetchchecklist',
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

  // 查看清单
  const getViewList = (todoCode) => {
    dispatch({
      type: 'releaseverificat/viewlist',
      payload: {
        todoCode
      },
    })
  }

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
    total: checktotals,
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

  // 合并工单号相同的行
  const temp = {};
  const mergeCells = (text, array, columns) => {
    let i = 0;
    if (text !== temp[columns]) {
      temp[columns] = text;
      array.forEach((item) => {
        if (item[columns] === temp[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };

  const columns = [
    {
      title: '验证工单',
      dataIndex: 'todoCode',
      key: 'todoCode',
      render: (text, record) => {
        const handleClick = () => {
          router.push({
            pathname: `/ITSM/releasemanage/checktodo/record`,
            query: {
              Id: record.todoCode,
              releaseNo: record.releaseNo,
              titletype: '业务复核'
            },
            state: {
              runpath: location.pathname,
              dynamicpath: true,
              menuDesc: '业务复核',
            }
          });
        };
        const obj = {
          children: <a onClick={handleClick}>{text}</a>,
          props: {},
        };
        obj.props.rowSpan = mergeCells(record.todoCode, checklist, 'todoCode');
        return obj;
      },
    },
    {
      title: '状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
    },
    {
      title: '发布清单',
      dataIndex: 'releaseNo',
      key: 'releaseNo',
      render: (text, record) => {
        return <Tooltip title="点击行查看清单">查看清单</Tooltip>;
      },
    },
    {
      title: '发送人',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
    },
  ];

  const expandedRowRender = () => {
    const columnSun = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
          return <>{`${index + 1}`}</>;
        },
      },
      {
        title: '功能类型',
        dataIndex: 'abilityType',
        key: 'abilityType',
        width: 150,
      },
      {
        title: '模块',
        dataIndex: 'module',
        key: 'module',
        width: 120,
      },
      {
        title: '功能名称',
        dataIndex: 'appName',
        key: 'appName',
        width: 150,
      },
      {
        title: '问题类型',
        dataIndex: 'problemType',
        key: 'problemType',
        width: 150,
      },
      {
        title: '测试内容及预期效果',
        dataIndex: 't5',
        key: 't5',
        width: 300,
        render: (text, record) => {
          return (
            <>
              <InputGroup compact>
                <span style={{ width: 70, textAlign: 'right' }}>功能菜单：</span>
                <span style={{ width: 200 }}>{record.testMenu}</span>
              </InputGroup>
              <Divider type='horizontal' style={{ margin: '6px 0' }} />
              <InputGroup compact>
                <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
                <span style={{ width: 200 }}>{record.testResult}</span>
              </InputGroup>
              <Divider type='horizontal' style={{ margin: '6px 0' }} />
              <InputGroup compact>
                <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
                <span style={{ width: 200 }}>{record.testStep}</span>
              </InputGroup>
            </>
          );
        }
      },
      {
        title: '是否通过',
        dataIndex: 'passTest',
        key: 'passTest',
        align: 'center',
        width: 100,
      },
      {
        title: '开发人员',
        dataIndex: 'developer',
        key: 'developer',
        width: 100,
      },
      {
        title: '操作人员',
        dataIndex: 'operator',
        key: 'operator',
        align: 'center',
        width: 100,
      },
    ];
    const key = Object.keys(viewlist)[0];
    return (
      <div style={{ margin: '0 48px 24px 0', }}>
        <div style={{ marginBottom: 12 }}>{viewmsg[key]}</div>
        <Table
          columns={columnSun}
          dataSource={viewlist[key]}
          size='small'
          pagination={false}
          loading={viewloading}
          bordered />
      </div>
    );
  };

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
          expandedRowRender={expandedRowRender}
          expandRowByClick
          onRow={record => {
            return {
              onClick: e => { e.preventDefault(); getViewList(record.todoCode) },
            };
          }}
          dataSource={checklist}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={(_, index) => index.toString()}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releaseverificat, loading }) => ({
    checklist: releaseverificat.checklist,
    checktotals: releaseverificat.checktotals,
    viewlist: releaseverificat.viewlist,
    viewmsg: releaseverificat.viewmsg,
    loading: loading.effects['releaseverificat/fetchchecklist'],
    viewloading: loading.effects['releaseverificat/viewlist'],
  }))(Checktodo),
);
