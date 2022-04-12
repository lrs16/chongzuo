import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Select, Button, Table, message, Modal, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import UserContext from '@/layouts/MenuContext';
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import { knowledgeCheckUserList } from '@/services/user';
import RangeTime from '@/components/SelectTime/RangeTime';
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
  const [tabrecord, setTabRecord] = useState({});
  const ExmaineRef = useRef(null);

  const userId = sessionStorage.getItem('userauthorityid');
  const time1 = starttime ? moment(starttime) : undefined;
  const time2 = endtime ? moment(endtime) : undefined;

  // 设置表单初始值
  const indexval = {
    no: '',
    type: '',
    status: '',
    time1,
    time2,
    paginations,
    expand,
  };
  const cacheinfo = location.state?.cacheinfo ? location.state.cacheinfo : indexval;

  const sendTabVal = () => {
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: {
          ...tabrecord,
          paginations,
          expand,
        },
        tabid: sessionStorage.getItem('tabid')
      },
    });
  }

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
      time1: values.registtime?.startTime ? moment(values.registtime?.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
      time2: values.registtime?.endTime ? moment(values.registtime?.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      time3: values.edittime?.startTime ? moment(values.edittime?.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
      time4: values.edittime?.endTime ? moment(values.edittime?.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      tab: statusmap.get(pagetitle),
      registtime: {},
      edittime: {},
    };
    dispatch({
      type: 'knowledg/fetchlist',
      payload: {
        ...val
      },
    });
    setTabRecord({ ...val });
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
        time1: values.registtime?.startTime || '',
        time2: values.registtime?.endTime || '',
        time3: values.edittime?.startTime || '',
        time4: values.edittime?.endTime || '',
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
      case 'submit': {
        const newselectds = selectedRecords.filter(item => item.status === '已登记');
        if (newselectds.length > 0) {
          knowledgeCheckUserList().then(res => {
            if (res.code === 200) {
              setUserList(res.data);
              setUserVisible(true)
            }
          })
        };
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态为‘已登记’的数据进行操作')
        };
        if (selectedRecords.length > 0 && newselectds.length === 0) {
          message.error('请选择知识状态为‘已登记’的数据')
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
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
            handleSearch(1, 15);
            setSelectedRowKeys([]);
            setSelectedRecords([]);
          })
        };
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态为‘已登记’的数据进行操作')
        };
        if (selectedRecords.length > 0 && newselectds.length === 0) {
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
            handleSearch(1, 15);
            setSelectedRowKeys([]);
            setSelectedRecords([]);
          })
        };
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态为‘已发布’的数据进行操作')
        };
        if (selectedRecords.length > 0 && newselectds.length === 0) {
          message.error('请选择知识状态为‘已发布’的数据');
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      case 'abolish': {
        const newselectds = selectedRecords.filter(item => item.status === '已发布');
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
            handleSearch(1, 15);
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            setPageinations({ current: 1, pageSize: 15 })
          })
        };
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态为‘已发布’的数据进行操作')
        };
        if (selectedRecords.length > 0 && newselectds.length === 0) {
          message.error('仅能选择状态为‘已发布’的数据');
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      case 'mydelete': {
        const newselectds = selectedRecords.filter(item => item.status === '已登记');
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
            handleSearch(1, 15);
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            setPageinations({ current: 1, pageSize: 15 })

          })
        };
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态为‘已登记’的数据进行操作')
        };
        if (selectedRecords.length > 0 && newselectds.length === 0) {
          message.error('仅能选择状态为‘已登记’的数据');
          setSelectedRowKeys([]);
          setSelectedRecords([]);
        }
        break;
      }
      case 'delete': {
        const newselectds = selectedRecords.filter(item => item.status !== '已发布');
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
            handleSearch(1, 15);
            setSelectedRowKeys([]);
            setSelectedRecords([]);
            setPageinations({ current: 1, pageSize: 15 })
          })
        };
        if (selectedRecords.length === 0) {
          message.error('您还没有选择数据，请选择状态不为‘已发布’的数据进行操作')
        };
        if (selectedRecords.length > 0 && newselectds.length === 0) {
          message.error('仅能选择状态不为‘已发布’的数据');
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
    sendTabVal();
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
    handleSearch(1, size);
    setPageinations({
      ...paginations,
      current: 1,
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
        handleSearch(1, 15);
        setSelectedRowKeys([]);
        setSelectedRecords([]);
        setPageinations({ current: 1, pageSize: 15 })
        setChoiceUser({ users: '', ischange: false });
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
  const typemap = getTypebyId(585);         // 知识分类
  const statusmap = getTypebyId(586);       // 知识状态

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
          sendTabVal();
          router.push({
            pathname: ((pagetitle !== '知识审核' && (record.status !== '已登记')) || (pagetitle === '知识审核' && record.status !== '待审核')) ? '/ITSM/knowledgemanage/query/details' : `${location.pathname}/operation`,
            query: {
              Id: record.no,
              mainId: record.id
            },
            state: {
              runpath: location.pathname,
              title: pagetitle,
              dynamicpath: true,
              menuDesc: (record.status === '已登记' || (pagetitle === '知识审核' && record.status === '待审核')) ? desmap.get(pagetitle) : '知识详情',
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
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement='topLeft' title={text}>{text}</Tooltip>
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
      title: '登记时间',
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

  const coldownload = {
    title: '附件下载',
    dataIndex: 'dowload',
    key: 'dowload',
  };

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        sendTabVal()
      };
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset()
      };
      if (location.state.cacheinfo) {
        if (location.state.cacheinfo.paginations) {
          const { current, pageSize } = location.state.cacheinfo.paginations;
          setPageinations({ ...paginations, current, pageSize });
        }
        setExpand(location.state.cacheinfo.expand);
      };
    }
  }, [location.state]);

  useEffect(() => {
    handleSearch(1, 15);
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, [location]);

  useEffect(() => {
    if (statist) {
      setExpand(true);
      setFieldsValue({ addUser });
      if (type) {
        setFieldsValue({ type });
      };
      handleSearch(1, 15)
    }
  }, [statist]);

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 524
      } else {
        height = clientHeight - 440
      }
    }
    return height
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="584"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <div className='noexplain'>
          <Row gutter={8}>
            <Form {...formItemLayout} onSubmit={handleSearch}>
              <Col span={8}>
                <Form.Item label="知识编号">
                  {getFieldDecorator('no', {
                    initialValue: cacheinfo.no,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="知识分类">
                  {getFieldDecorator('type', {
                    initialValue: type || cacheinfo.type,
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
              <span style={{ display: expand || starttime || endtime ? 'block' : 'none' }}>
                <Col span={8}>
                  <Form.Item label="登记时间">
                    {getFieldDecorator('registtime', {
                      initialValue: { startTime: cacheinfo.time1, endTime: cacheinfo.time2 },
                    })(<></>)}
                    <RangeTime
                      startVal={cacheinfo?.time1}
                      endVal={cacheinfo?.time2}
                      getTimes={(v) => { setFieldsValue({ registtime: v }) }}
                    />
                  </Form.Item>
                  {/* <Form.Item label="登记时间" >
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('time1', {
                          initialValue: cacheinfo.time1,
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
                  </Form.Item> */}
                </Col>
                <Col span={8}>
                  <Form.Item label="知识标题">
                    {getFieldDecorator('title', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </span>
              {pagetitle === '我的知识' && (<Col span={8}>
                <Form.Item label="知识状态">
                  {getFieldDecorator('status', {
                    initialValue: cacheinfo.status,
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
                    initialValue: cacheinfo.status,
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
              <span style={{ display: expand ? 'block' : 'none' }}>
                <Col span={8}>
                  <Form.Item label="知识内容">
                    {getFieldDecorator('content', {
                      initialValue: cacheinfo.content,
                    })(<Input placeholder="请输入" allowClear />,)}
                  </Form.Item>
                </Col>
              </span>
              <span style={{ display: expand || pagetitle === '知识查询' ? 'block' : 'none' }}>
                <Col span={8}>
                  <Form.Item label="作者">
                    {getFieldDecorator('addUser', {
                      initialValue: addUser || cacheinfo.addUser,
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
              </span>
              <span style={{ display: expand ? 'block' : 'none' }}>
                <Col span={8}>
                  <Form.Item label="编辑人">
                    {getFieldDecorator('updateUser', {
                      initialValue: cacheinfo.updateUser,
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
                  <Form.Item label="编辑时间">
                    {getFieldDecorator('edittime', {
                      initialValue: { startTime: cacheinfo.time3, endTime: cacheinfo.time4 },
                    })(<></>)}
                    <RangeTime
                      startVal={cacheinfo?.time3}
                      endVal={cacheinfo?.time4}
                      getTimes={(v) => { setFieldsValue({ edittime: v }) }}
                    />
                  </Form.Item>
                  {/* <Form.Item label="编辑时间" >
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('time3', {
                          initialValue: cacheinfo.time3 ? moment(cacheinfo.time3) : '',
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
                          initialValue: cacheinfo.time4 ? moment(cacheinfo.time4) : '',
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
                  </Form.Item> */}
                </Col>
              </span>
              <Col span={24} style={{ paddingTop: 4, textAlign: 'right' }}>{extra}</Col>
            </Form>
          </Row>
        </div>
        <div>
          {pagetitle === '我的知识' && (
            <>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => newknowledge()}>新增</Button >
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => ClickBut('submit')}>提交</Button >
            </>
          )}
          {pagetitle === '知识维护' && (
            <>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => newknowledge('edit')}>新增</Button >
              {/* <Button type="primary" style={{ marginRight: 8 }} onClick={() => ClickBut('submit')}>提交</Button > */}
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
          scroll={{ x: 1300, y: setTableHeight() }}
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