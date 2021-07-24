import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table, message, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import UserContext from '@/layouts/MenuContext';
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import { knowledgeCheckUserList } from '@/services/user';
import { submitkowledge, releasekowledge, revokekowledge, abolishkowledge, deletekowledge } from './services/api';
import Examine from './components/Examine';

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
    location, location: { query: { addUser, type, statist, starttime, endtime } }, loading, list, userinfo,
    form: { getFieldDecorator, resetFields, getFieldsValue, setFieldsValue },
    dispatch,
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [expand, setExpand] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [choiceUser, setChoiceUser] = useState({ users: '', ischange: false });
  const [userlist, setUserList] = useState([]);
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visible, setVisible] = useState(false);
  const ExmaineRef = useRef(null);

  const userId = sessionStorage.getItem('userauthorityid');

  const handleSearch = (page, size) => {
    const values = getFieldsValue();
    const statusmap = new Map([
      ['我的知识', '1'],
      ['知识维护', '2'],
      ['知识审核', '3'],
      ['知识查询', '4'],
    ]);
    const val = {
      ...values,
      pageIndex: page,
      pageSize: size,
      addUserId: pagetitle === '我的知识' ? sessionStorage.getItem('userauthorityid') : '',
      checkUserId: pagetitle === '知识审核' ? sessionStorage.getItem('userauthorityid') : '',
      time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
      time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
      time3: values.time3 ? moment(values.time3).format('YYYY-MM-DD HH:mm:ss') : '',
      time4: values.time4 ? moment(values.time4).format('YYYY-MM-DD HH:mm:ss') : '',
      tab: statusmap.get(pagetitle),
    };
    dispatch({
      type: 'knowledg/fetchlist',
      payload: {
        ...val
      },
    });
  }
  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    if (addUser) {
      setFieldsValue({ addUser: '' })
    };
    if (type) {
      setFieldsValue({ type: '' })
    };
    if (starttime) {
      setFieldsValue({ time1: '' })
    };
    if (endtime) {
      setFieldsValue({ time2: '' })
    };
    handleSearch(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };
  const download = () => {
    const values = getFieldsValue();
    const statusmap = new Map([
      ['我的知识', '1'],
      ['知识维护', '2'],
      ['知识审核', '3'],
      ['知识查询', '4'],
    ]);
    dispatch({
      type: 'knowledg/downloadquery',
      payload: {
        ...values,
        addUserId: pagetitle === '我的知识' ? sessionStorage.getItem('userauthorityid') : '',
        checkUserId: pagetitle === '知识审核' ? sessionStorage.getItem('userauthorityid') : '',
        time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
        time3: values.time3 ? moment(values.time3).format('YYYY-MM-DD HH:mm:ss') : '',
        time4: values.time4 ? moment(values.time4).format('YYYY-MM-DD HH:mm:ss') : '',
        tab: statusmap.get(pagetitle),
        ids: selectedRowKeys.length === 0 ? '' : selectedRowKeys.toString(),
      },
    }).then(res => {
      const filename = `知识查询${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };
  const ClickBut = (buttype) => {
    switch (buttype) {
      case 'submit':
        knowledgeCheckUserList().then(res => {
          if (res.code === 200) {
            setUserList(res.data);
            setUserVisible(true)
          }
        })
        break;
      case 'check':
        setVisible(true)
        break;
      case 'release': {
        const newselectds = selectedRecords.filter(item => item.status === '已登记');
        if (newselectds.length > 0) {
          const mainIds = newselectds.map(item => {
            return item.id;
          });
          releasekowledge({ mainIds, userId }).then(res => {
            if (res.code === 200) {
              message.success(res.msg)
            } else {
              message.error(res.msg)
            };
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            handleSearch(1, 15);
          })
        } else {
          message.error('请选择知识状态为‘已登记’的数据')
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      case 'revoke': {
        const newselectds = selectedRecords.filter(item => item.status === '已发布');
        if (newselectds.length > 0) {
          const mainIds = newselectds.map(item => {
            return item.id;
          });
          revokekowledge({ mainIds, userId }).then(res => {
            if (res.code === 200) {
              message.success(res.msg)
            } else {
              message.error(res.msg)
            };
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            handleSearch(1, 15);
          })
        } else {
          message.error('请选择知识状态为‘已发布’的数据');
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      case 'abolish': {
        const newselectds = selectedRecords.filter(item => item.status === '已发布');
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态不为‘发布中’的数据进行操作')
        }
        if (newselectds.length > 0) {
          const mainIds = newselectds.map(item => {
            return item.id;
          });
          abolishkowledge({ mainIds, userId }).then(res => {
            if (res.code === 200) {
              message.success(res.msg)
            } else {
              message.error(res.msg)
            };
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            handleSearch(1, 15);
            setPageinations({ current: 1, pageSize: 15 })
          })
        } else {
          message.error('仅能选择状态不为‘发布中’的数据');
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      case 'mydelete': {
        const newselectds = selectedRecords.filter(item => item.status === '已登记');
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态不为‘发布中’的数据进行操作')
        }
        if (newselectds.length > 0) {
          const mainIds = newselectds.map(item => {
            return item.id;
          });
          deletekowledge({ mainIds, userId }).then(res => {
            if (res.code === 200) {
              message.success(res.msg)
            } else {
              message.error(res.msg)
            };
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            handleSearch(1, 15);
            setPageinations({ current: 1, pageSize: 15 })

          })
        } else {
          message.error('仅能选择状态不为‘发布中’的数据');
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      case 'delete': {
        const newselectds = selectedRecords.filter(item => item.status !== '已发布');
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态不为‘发布中’的数据进行操作')
        }
        if (newselectds.length > 0) {
          const mainIds = newselectds.map(item => {
            return item.id;
          });
          deletekowledge({ mainIds, userId }).then(res => {
            if (res.code === 200) {
              message.success(res.msg)
            } else {
              message.error(res.msg)
            };
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            handleSearch(1, 15);
            setPageinations({ current: 1, pageSize: 15 })
          })
        } else {
          message.error('仅能选择状态不为‘发布中’的数据');
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      default:
        break;
    }
  };
  const handleOk = () => {
    const values = ExmaineRef.current.getVal();
    const newselectds = selectedRecords.filter(item => item.status === '待审核');
    if (newselectds.length > 0) {
      const mainIds = newselectds.map(item => {
        return item.id;
      });
      const val = {
        ...values,
        checkTime: moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss')
      }
      submitkowledge({ ...val, mainIds, userId }).then(res => {
        console.log(res)
      })
    }

    setVisible(false)
  };
  const handleCancel = () => {
    setVisible(false)
  }
  const newknowledge = (edittype) => {
    if (edittype === 'edit') {
      router.push({
        pathname: '/ITSM/knowledgemanage/myknowledge/new',
        query: {
          addtab: true,
          menuDes: '知识维护'
        },
      })
    } else {
      router.push({
        pathname: '/ITSM/knowledgemanage/myknowledge/new',
        query: {
          addtab: true,
        }
      })
    }

  }
  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
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

  // 选人完成提交
  useEffect(() => {
    if (choiceUser.ischange) {
      const newselectds = selectedRecords.filter(item => item.status === '已登记');
      if (newselectds.length > 0) {
        const mainIds = newselectds.map(item => {
          return item.id;
        })
        submitkowledge({ mainIds, userId: choiceUser.users }).then(res => {
          if (res.code === 200) {
            message.success(res.msg)
          }
        });
        setSelectedRowKeys([]);
        setSelectedRecords([]);
        handleSearch(1, 15);
        setChoiceUser({ users: '', ischange: false });
      } else {
        message.error('仅能选择状态为‘已登记’的数据')
      }
    }
  }, [choiceUser.ischange])

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
    <Button type="primary" onClick={() => handleSearch(1, 15)}>查 询</Button>
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
            pathname: record.status !== '已发布' ? `${location.pathname}/operation` : '/ITSM/knowledgemanage/query/details',
            query: {
              Id: record.no,
              mainId: record.id
            },
            state: {
              runpath: location.pathname,
              title: pagetitle,
              dynamicpath: true,
              menuDesc: (record.status === '已登记' || pagetitle === '知识审核') ? desmap.get(pagetitle) : '知识详情',
              status: record.status,
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
      dataIndex: 'addUser',
      key: 'addUser',
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

  const time1 = starttime ? moment(starttime).format('YYYY-MM-DD HH:mm:ss') : '';
  const time2 = endtime ? moment(endtime).format('YYYY-MM-DD HH:mm:ss') : '';

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset()
      };
    }
  }, [location.state]);


  useEffect(() => {
    handleSearch(1, 15);
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  useEffect(() => {
    if (statist) {
      setExpand(true);
      setFieldsValue({ addUser });
      if (type) {
        setFieldsValue({ type });
      };
      handleSearch(1, 15)
    }
  }, [statist])

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
            <Col span={8}>
              <Form.Item label="知识分类">
                {getFieldDecorator('type', {
                  initialValue: type || '',
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
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="登记时间" >
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('time1', {
                          initialValue: time1 ? moment(time1) : '',
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
                          initialValue: time2 ? moment(time2) : '',
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
            {pagetitle === '我的知识' && (<Col span={8}>
              <Form.Item label="知识状态">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {statusmap.map(obj => {
                      if (obj.title !== '已废止') return (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      )
                      return null
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>)}
            {(pagetitle === '知识维护' || pagetitle === '知识审核') && (<Col span={8}>
              <Form.Item label="知识状态">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {statusmap.map(obj => {
                      return (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      )
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>)}
            {expand && (
              <Col span={8}>
                <Form.Item label="知识内容">
                  {getFieldDecorator('content', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />,)}
                </Form.Item>
              </Col>
            )}
            {(expand || pagetitle === '知识查询') && (
              <Col span={8}>
                <Form.Item label="作者">
                  {getFieldDecorator('addUser', {
                    initialValue: addUser || '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
            )}
            {expand && (
              <>
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
            <Col span={24} style={{ paddingTop: 4, textAlign: 'right' }}>{extra}</Col>
          </Form>
        </Row>

        <div style={{ marginBottom: 24 }}>
          {pagetitle === '我的知识' && (
            <>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => newknowledge()}>新增</Button >
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => ClickBut('submit')}>提交</Button >
            </>
          )}
          {pagetitle === '知识维护' && (
            <>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => newknowledge('edit')}>新增</Button >
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => ClickBut('submit')}>提交</Button >
            </>
          )}
          {/* {(pagetitle === '知识审核') && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => ClickBut('check')}>审核</Button >
          )} */}
          {pagetitle === '知识维护' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => ClickBut('release')}>发布</Button >
          )}
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
          {(pagetitle === '知识审核' || pagetitle === '知识维护') && (
            <Button type="danger" style={{ marginRight: 8 }} onClick={() => ClickBut('revoke')}>撤销发布</Button >
          )}
          {(pagetitle === '知识审核') && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => ClickBut('abolish')}>废止</Button >
          )}
          {(pagetitle === '我的知识') && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => ClickBut('mydelete')}>删除</Button >
          )}
          {(pagetitle === '知识维护') && (
            <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => ClickBut('delete')}>删除</Button >
          )}
        </div>
        < Table
          loading={loading}
          columns={columns}
          dataSource={list.data}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.id}
          scroll={{ x: 1300 }}
        />
      </Card>
      <UserContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '审核' }}>
        <CheckOneUser userlist={userlist} />
      </UserContext.Provider>
      <Modal
        title="知识审核"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <Examine
          wrappedComponentRef={ExmaineRef}
          userinfo={userinfo}
          formrecord={{}}
          Noediting
        />
      </Modal>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ knowledg, itsmuser, loading }) => ({
    list: knowledg.list,
    userinfo: itsmuser.userinfo,
    loading: loading.models.knowledg,
  }))(KnowledgeList),
);