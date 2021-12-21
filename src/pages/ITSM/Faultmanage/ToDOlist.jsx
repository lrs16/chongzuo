import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Card,
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Icon,
  Table,
  Cascader,
  // Popconfirm
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Option } = Select;
const { RangePicker } = DatePicker;

function ToDOlist(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    loading,
    dispatch,
    faultTodoList, // 真实待办列表数据
    location,
  } = props;

  const [expand, setExpand] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 }); // 分页state
  const [selectdata, setSelectData] = useState('');
  const [tabrecord, setTabRecord] = useState({});
  // const [selectedKeys, setSelectedKeys] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 100,
    //   render: (text, record, index) =>
    //     `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    // },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '故障编号',
      dataIndex: 'no',
      key: 'no',
      width: 140,
      render: (text, record) => {
        const handleClick = () => {
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
          router.push({
            pathname: `/ITSM/faultmanage/todolist/record`,
            query: {
              id: record.id,
              mainId: record.mainId,
              orderNo: text,
            },
            state: {
              cacheinfo: {
                ...tabrecord,
                paginations,
                expand,
              },
            }
          });
        };
        return <a onClick={() => handleClick()}>{text}</a>;
      },
    },
    {
      title: '故障名称',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '故障来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: '故障类型',
      dataIndex: 'typecn',
      key: 'typecn',
      width: 100,
    },
    {
      title: '当前处理环节',
      dataIndex: 'currentNode',
      key: 'currentNode',
      width: 180,
    },
    {
      title: '登记人',
      dataIndex: 'registerUser',
      key: 'registerUser',
      width: 80,
    },
    {
      title: '发生时间',
      dataIndex: 'registerOccurTime',
      key: 'registerOccurTime',
      width: 180,
    },
    {
      title: '严重程度',
      dataIndex: 'registerLevel',
      key: 'registerLevel',
      width: 100,
    },
  ];

  const getTodolists = (current, pageSize) => {
    validateFields((err, values) => {
      const newvalues = {
        ...values,
        // type: values.type ? (values.type).slice(-1)[0] : '',
        createTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        createTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        createTime: '',
      }
      if (!err) {
        dispatch({
          type: 'fault/getSearchfaultTodo',
          payload: { pageNum: current, pageSize, ...newvalues, type: values.type === [] ? '' : (values.type).slice(-1)[0], },
        });
        setTabRecord({ ...newvalues });
      }
    });
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    getTodolists(1, 15);
    setPageinations({ current: 1, pageSize: 15 });
  };

  const onShowSizeChange = (page, pageSize) => {
    getTodolists(page, pageSize);
    setPageinations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = page => {
    getTodolists(page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: faultTodoList ? faultTodoList.total : '',
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  // const rowSelection = {
  //   onChange: (index, handleSelect) => {
  //     setSelectedKeys([...index])
  //     setSelectedRows([...handleSelect])
  //   }
  // }

  //  下载 /导出功能
  // const download = (page, pageSize) => {
  //   validateFields((err, values) => {
  //     console.log('values: ', values);
  //     if (!err) {
  //       dispatch({
  //         type: 'fault/faultTododownload',
  //         payload: {
  //           ...values,
  //           ids: selectedKeys.toString(),
  //           addTimeBegin: values.createTime?.length ? moment(values.createTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
  //           addTimeEnd: values.createTime?.length ? moment(values.createTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
  //           createTime: '',
  //           type:values.type.toString(),
  //           pageSize,
  //           pageNum: page,
  //         },
  //       }).then(res => {
  //         console.log('res: ', res);
  //         const filename = `下载.xls`;
  //         const url = window.URL.createObjectURL(res);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = filename;
  //         a.click();
  //         window.URL.revokeObjectURL(url);
  //       });
  //     }
  //   });
  // };

  // 设置初始值
  const record = {
    createTime: '',
    currentNode: '',
    no: '',
    registerLevel: '',
    registerUser: '',
    source: '',
    title: '',
    type: [],
    paginations,
  };
  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  // 获取数据
  useEffect(() => {
    getTodolists(cacheinfo.paginations.current, cacheinfo.paginations.pageSize)
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
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
      };
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
        setExpand(false);
      };
      if (location.state.cacheinfo) {
        if (location.state.cacheinfo.paginations) {
          const { current, pageSize } = location.state.cacheinfo.paginations;
          setPageinations({ ...paginations, current, pageSize });
        }
        const { createTimeBegin, createTimeEnd } = location.state.cacheinfo;

        setExpand(location.state.cacheinfo.expand);
        setFieldsValue({
          createTime: createTimeBegin ? [moment(createTimeBegin), moment(createTimeEnd)] : '',
        });
      };
    }
  }, [location.state]);

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const faultSource = getTypebyTitle('故障来源');
  const priority = getTypebyTitle('严重程度');
  const currentNode = getTypebyTitle('当前处理环节');
  const faultType = getTypebyTitle('故障分类');

  const extra = (<>
    <Button type="primary" onClick={() => getTodolists(1, 15)}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={handleReset}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>收起 <Icon type="up" /></>) : (<>展开 <Icon type="down" /></>)}
    </Button>
  </>)

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="333"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout} onSubmit={() => getTodolists()}>
            <Col span={8}>
              <Form.Item label="故障编号">
                {getFieldDecorator('no', {
                  initialValue: cacheinfo.no,
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="故障名称">
                  {getFieldDecorator('title', {
                    initialValue: cacheinfo.title,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="故障来源">
                  {getFieldDecorator('source', {
                    initialValue: cacheinfo.source,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {faultSource.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </span>
            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator(
                  'currentNode', {
                  initialValue: cacheinfo.currentNode,
                },
                )(
                  <Select placeholder="请选择" allowClear>
                    {currentNode.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="故障类型">
                  {getFieldDecorator('type', {
                    initialValue: cacheinfo.type,
                  })(
                    <Cascader
                      placeholder="请选择"
                      options={faultType}
                      fieldNames={{ label: 'title', value: 'dict_code', children: 'children' }}
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="登记人">
                  {getFieldDecorator('registerUser', {
                    initialValue: cacheinfo.registerUser,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>

              <Col xl={8}>
                <Form.Item label="严重程度">
                  {getFieldDecorator('registerLevel', {
                    initialValue: cacheinfo.registerLevel,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {priority.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="发生时间">
                  {getFieldDecorator('createTime', {
                    initialValue: ''
                  })(
                    <RangePicker
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                      }}
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
            </span>
            {expand ? (<Col span={8} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
          </Form>
        </Row>
        {/* <div style={{ marginBottom: 24 }}>
          <Popconfirm title="确定导出数据？" onConfirm={() => download()}>
            <Button type="primary">导出数据</Button>
          </Popconfirm>
        </div> */}
        <Table
          loading={loading}
          columns={columns.filter(item => item.title !== 'id' || item.key !== 'id')}
          dataSource={faultTodoList.rows}
          rowKey={r => r.id}
          pagination={pagination}
          scroll={{ x: 800 }}
        // rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ fault, loading }) => ({
    faultTodoList: fault.faultTodoList, // 真实故障待办列表
    html: fault.html,
    loading: loading.models.fault,
  }))(ToDOlist),
);
