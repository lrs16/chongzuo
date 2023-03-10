import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Table,
  Card,
  Button,
  // Message,
  Tooltip,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Icon,
  Popover,
  Checkbox
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';
// import AgentDrawer from './components/AgentDrawer';

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

function TestEnvironmentManage(props) {
  const pagetitle = props.route.name;
  const {
    dispatch, list, loading, location,
    form: { getFieldDecorator, getFieldsValue, resetFields },
  } = props;

  let formThead;

  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  // const [visible, setVisible] = useState(false); // 抽屉是否显示
  // const [title, setTitle] = useState('');
  // const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  // const [data, setData] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [columns, setColumns] = useState([]); // 动态表格

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.startTime = values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : ''
    values.endTime = values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : ''
    dispatch({
      type: 'agentmanage/query',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  // const handleShowDrawer = (drwertitle, type, record) => {
  //   setVisible(!visible);
  //   setTitle(drwertitle);
  //   // setSaveType(type);
  //   setData(record);
  // };

  // 提交
  // const handleSubmit = values => {
  //   dispatch({
  //     type: 'agentmanage/update',
  //     payload: {
  //       ...values,
  //     },
  //   }).then(res => {
  //     if (res.code === 200) {
  //       Message.success(res.msg);
  //       searchdata(1, 15);
  //     }
  //   });
  // };

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  }

  const onShowSizeChange = (page, size) => {
    searchdata(1, size);
    setPageinations({
      ...paginations,
      current: 1,
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
    total: list.total,
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

  const initialColumns = [
    {
      title: '名称',
      dataIndex: 'agentName',
      key: 'agentName',
      width: 300,
    },
    {
      title: 'IP地址',
      dataIndex: 'agentHost',
      key: 'agentHost',
      width: 150,
    },
    {
      title: '协议',
      dataIndex: 'agentHyper',
      key: 'agentHyper',
      width: 80,
    },
    {
      title: '端口',
      dataIndex: 'agentPort',
      key: 'agentPort',
      width: 80,
    },
    {
      title: '操作系统',
      dataIndex: 'agentOsType',
      key: 'agentOsType',
      width: 100,
    },
    {
      title: '区域',
      dataIndex: 'agentZone',
      key: 'agentZone',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'agentType',
      key: 'agentType',
      width: 80,
    },
    {
      title: 'token',
      dataIndex: 'agentToken',
      key: 'agentToken',
      width: 120,
    },
    {
      title: '目录',
      dataIndex: 'agentDeploy',
      key: 'agentDeploy',
      width: 250,
      onCell: () => {
        return {
          style: {
            maxWidth: 250,
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
      title: '状态',
      dataIndex: 'agentStatus',
      key: 'agentStatus',
      width: 80,
    },
    {
      title: '节点地址',
      dataIndex: 'nodeHost',
      key: 'nodeHost',
      width: 120,
    },
    {
      title: '节点端口',
      dataIndex: 'nodePort',
      key: 'nodePort',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'agentRemarks',
      key: 'agentRemarks',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 250,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'action',
    //   key: 'action',
    //   fixed: 'right',
    //   width: 150,
    //   render: (_, record) => {
    //     return (
    //       <div>
    //         <a type="link" onClick={() => handleShowDrawer('编辑agent', 'update', record)}>
    //           编辑
    //         </a>
    //       </div>
    //     );
    //   },
    // },
  ];

  // 动态列表名称
  const defaultAllkey = columns.map(item => {
    return item.title;
  });

  // 创建列表
  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map(val => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: 250,
        ellipsis: true,
        onCell: val.title === '目录' ? () => {
          return {
            style: {
              maxWidth: 250,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer'
            }
          }
        } : () => { },
      };
      if (val.title === '目录') {
        obj.render = (text) => {
          return (
            <Tooltip placement='topLeft' title={text} >{text}</Tooltip>
          )
        }
      }
      // if (val.title === '操作') {
      //   obj.render = (_, record) => {
      //     return (
      //       <div>
      //         <a type="link" onClick={() => handleShowDrawer('编辑agent', 'update', record)}>
      //           编辑
      //         </a>
      //       </div>
      //     )
      //   }
      //   obj.fixed = 'right'
      // }
      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
    }
    )
  };

  // 列表设置
  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : [])
  };

  // 列名点击
  const onCheck = (checkedValues) => {
    formThead = initialColumns.filter(i =>
      checkedValues.indexOf(i.title) >= 0
    );

    if (formThead.length === 0) {
      setColumns([]);
    }
    creataColumns();
  };

  useEffect(() => {
    searchdata(1, 15);
    setColumns(initialColumns);
  }, [location]);

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
  const typemap = getTypebyId(105);         // 类型
  const statusmap = getTypebyId(106);       // 状态
  const zonemap = getTypebyId(107);         // 区域

  const setTableHeight = () => {
    let height = 500;
    // 最小兼容1600的全屏显示器
    const clientHeight = window.document?.body?.clientHeight;
    if (clientHeight > 750) {
      if (expand) {
        height = clientHeight - 568
      } else {
        height = clientHeight - 510
      }
    }
    return height;
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid={104}
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card bodyStyle={{ paddingBottom: 0 }}>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="agent名称">
                {getFieldDecorator('agentName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="agent区域">
                {getFieldDecorator('agentZone', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {zonemap.map(obj => (
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="agent类型">
                {getFieldDecorator('agentType', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {typemap.map(obj => (
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="agent状态">
                {getFieldDecorator('agentStatus', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {statusmap.map(obj => (
                      <Option key={obj.key} value={obj.dict_code}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="agent地址">
                {getFieldDecorator('agentHost', {
                  initialValue: '',
                })(
                  // <Select placeholder="请选择" allowClear>
                  //   {typemap.map(obj => (
                  //     <Option key={obj.key} value={obj.title}>
                  //       {obj.title}
                  //     </Option>
                  //   ))}
                  // </Select>
                  <Input placeholder="请输入" allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="节点地址" style={{ display: expand ? 'block' : 'none' }}>
                {getFieldDecorator('nodeHost', {
                  initialValue: '',
                })(
                  // <Select placeholder="请选择" allowClear>
                  //   {typemap.map(obj => (
                  //     <Option key={obj.key} value={obj.title}>
                  //       {obj.title}
                  //     </Option>
                  //   ))}
                  // </Select>
                  <Input placeholder="请输入" allowClear />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="agent备注" style={{ display: expand ? 'block' : 'none' }}>
                {getFieldDecorator('agentRemarks', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="创建时间" style={{ display: expand ? 'block' : 'none' }}>
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time1', {
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
            <Col span={8} style={{ paddingLeft: expand ? '5.666667%' : '24px' }}>{extra}</Col>
          </Form>
        </Row>
        {/* 列表设置 */}
        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <p style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={columns.length === initialColumns.length === true}
                  >
                    列表展示
                  </Checkbox>
                </p>
                <Checkbox.Group
                  onChange={onCheck}
                  value={defaultAllkey}
                  defaultValue={columns}
                >
                  {initialColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: 8 }}>
                      <Checkbox
                        value={item.title}
                        key={item.key}
                        checked={columns}
                      >
                        {item.title}
                      </Checkbox>
                    </Col>
                  ))}
                </Checkbox.Group>
              </>
            }
          >
            <Button>
              <Icon type="setting" theme="filled" style={{ fontSize: 14 }} />
            </Button>
          </Popover>
        </div>
        <Table
          columns={columns}
          dataSource={list.rows}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1150, y: setTableHeight() }}
        />
      </Card>
      {/* 抽屉 */}
      {/* <AgentDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        destroyOnClose
      /> */}
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ agentmanage, loading }) => ({
    list: agentmanage.list,
    loading: loading.models.agentmanage,
  }))(TestEnvironmentManage),
);