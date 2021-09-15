import React, {
  useEffect,
  useState
} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Button, Form, Input, Select, Row, Col, DatePicker, Divider, message, Popconfirm } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
import LocalScriptDrawer from './LocalScriptDrawer';
import LocalViewDrawer from './LocalViewDrawer';

const { Option } = Select;

function LocalScriptList(props) {
  const {
    loading,
    location,
    scriptsourcemap,
    scripttypemap,
    formItemLayout,
    dispatch,
    localscriptlist,
    userinfo,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    }, } = props;

  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  // const [selectedRows, setSelectedRows] = useState([]);
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    dispatch({
      type: 'scriptconfig/findLocalScriptList',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };


  useEffect(() => {
    searchdata(1, 15);
  }, [location]);

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      searchdata(1, 15);
    }
  }, [files]);

  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  const handleShowDrawer = (drwertitle, type, record) => {
    setVisible(!visible);
    setTitle(drwertitle);
    setSaveType(type);
    if (type === 'update') {
      setData(record);
    } else {
      setData({});
    }
  };

  // 提交
  const handleSubmit = values => {
    if (savetype === '' || savetype === 'add') {
      dispatch({
        type: 'scriptconfig/toaddlocalScript',
        payload: {
          ...values,
        },
      }).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          searchdata(1, 15);
        } else {
          message.error(res.msg);
        }
      });
    }
    if (savetype === 'update') {
      dispatch({
        type: 'scriptconfig/toeditlocalScript',
        payload: {
          ...values,
        },
      }).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          searchdata(1, 15);
        } else {
          message.error(res.msg);
        }
      });
    }
  };


  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const onShowSizeChange = (page, size) => {
    searchdata(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(page, paginations.pageSize);
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
    total: localscriptlist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  const handleDelete = id => { // 删除
    dispatch({
      type: 'scriptconfig/toDeletelocalScript',
      payload: { Ids: id },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '删除脚本成功');
        searchdata(1, 15);
      } else {
        message.error(res.msg);
      }
    });
  };

  const columns = [
    {
      title: '脚本编号',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (text, record) => {
        return (
          <LocalViewDrawer record={record}>
            <a type="link">{text}</a>
          </LocalViewDrawer>
        );
      },
    },
    {
      title: '区域',
      dataIndex: 'hostZoneId',
      key: 'hostZoneId',
      width: 120,
    },
    {
      title: '设备名称',
      dataIndex: 'hostName',
      key: 'hostName',
      width: 180,
    },
    {
      title: '主机IP',
      dataIndex: 'hostIp',
      key: 'hostIp',
      width: 200,
    },
    {
      title: '脚本名称',
      dataIndex: 'scriptName',
      key: 'scriptName',
      width: 200,
    },
    {
      title: '存放路径',
      dataIndex: 'scriptPath',
      key: 'scriptPath',
      width: 300,
      ellipsis: true,
    },
    {
      title: '脚本类型',
      dataIndex: 'scriptType',
      key: 'scriptType',
      width: 120,
    },
    {
      title: '脚本内容',
      dataIndex: 'scriptCont',
      key: 'scriptCont',
      width: 300,
      ellipsis: 'true',
    },
    {
      title: '脚本来源',
      dataIndex: 'scriptSource',
      key: 'scriptSource',
      width: 150,
    },
    {
      title: '脚本备注',
      dataIndex: 'scriptRemarks',
      key: 'scriptRemarks',
      width: 250,
    },
    {
      title: '脚本大小',
      dataIndex: 'scriptSize',
      key: 'scriptSize',
      width: 150,
    },
    {
      title: '上传人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 120,
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (text, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowDrawer('编辑本地脚本', 'update', record)}>编辑脚本</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此脚本吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link" style={{ color: 'red' }}>删除脚本</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

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

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const zonemap = getTypebyId('1428182995477942274'); // 主机区域

  return (
    <>
      <Card>
        <DictLower
          typeid="1428178684907835393"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="区域">
                {getFieldDecorator('hostZoneId', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {zonemap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="设备名称">
                {getFieldDecorator('hostName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={8}>
                  <Form.Item label="主机IP">
                    {getFieldDecorator('hostIp', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="脚本名称">
                    {getFieldDecorator('scriptName', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="存放路径">
                    {getFieldDecorator('scriptPath', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="脚本来源">
                    {getFieldDecorator('scriptSource', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择" allowClear>
                        {scriptsourcemap.map(obj => (
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>
                        ))}
                      </Select>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="脚本内容">
                    {getFieldDecorator('scriptCont', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="上传人">
                    {getFieldDecorator('createBy', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="上传时间">
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('startTime', {
                          // initialValue: '',
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
                        {getFieldDecorator('endTime', {
                          // initialValue: '',
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
            {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
          </Form>
        </Row>
        <div style={{ marginBottom: 8 }}>
          <Button type="primary" style={{ marginRight: 8 }}
            onClick={() => handleShowDrawer('新增本地脚本', 'add')}
          >新增</Button>
        </div>
        <Table
          dataSource={localscriptlist.rows}
          rowKey={record => record.id}
          scroll={{ x: 1300 }}
          columns={columns}
          paginations={pagination}
          loading={loading} />
      </Card>
      {/* 抽屉 */}
      <LocalScriptDrawer
        visible={visible}
        dispatch={dispatch}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        destroyOnClose
        savetype={savetype}
        scriptsourcemap={scriptsourcemap}
        scripttypemap={scripttypemap}
        userinfo={userinfo}
        files={files.arr}
        ChangeFiles={newvalue => { setFiles(newvalue) }}
      />
    </>
  );
}

export default Form.create({})(
  connect(({ scriptconfig, itsmuser, loading }) => ({
    localscriptlist: scriptconfig.localscriptlist,
    userinfo: itsmuser.userinfo,
    loading: loading.models.scriptconfig,
  }))(LocalScriptList),
);