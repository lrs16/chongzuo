import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
// import moment from 'moment';
import Link from 'umi/link';
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
  Popconfirm,
  // message,
  Cascader
  // Badge
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

// const severitystatus = ['紧急', '重大', '一般'];
// const statusMap = ['error', 'warning', 'processing'];

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

// const faultStatusmap = ['待登记', '已登记', '已受理', '待审核', '审核中', '已审核', '待处理', '处理中', '已处理', '待总结', '总结中', '已总结', '待关闭', '关闭中', '已关闭'];
// const sourceMap = ['系统告警', '巡检发现'];
// const registerModelMap = ['配网采集', '主网采集', '终端掉线', '配网档案', '实用化指标', '账号缺陷'];
// const typeMap = ['系统应用', '网络安全', '数据库', '中间件', '环境/设备', '软件', '其他'];

function QueryList(props) {
  const pagetitle = props.route.name;

  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    faultQueryList, // 查询列表数据
    dispatch,
  } = props;

  const [expand, setExpand] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 }); // 分页state
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectdata, setSelectData] = useState([]);

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 100,
    //   render: (text, record, index) => `${(paginations.current - 1) * (paginations.pageSize) + (index + 1)}`,
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
      width: 150,
      fixed: 'left',
      render: (text, record) => {
        return (
          <Link
            to={{
              pathname: `/ITSM/faultmanage/querylist/record/${record.id}`,
              record,
              paneKey: record.status, // 传状态
              ids: record.id,
            }}
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: '故障发生时间',
      dataIndex: 'registerOccurTime',
      key: 'registerOccurTime',
      width: 200,
      fixed: 'left',
    },
    {
      title: '故障登记时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      width: 200,
      fixed: 'left',
    },
    {
      title: '严重程度',
      dataIndex: 'registerLevel',
      key: 'registerLevel',
      width: 120,
      fixed: 'left',
      // render: (text, record) => {
      //   // console.log(text, record);
      //   <span>
      //   <Badge status={statusMap[record.registerLevel]} text={severitystatus[record.registerLevel]} />
      // </span>
      // },
    },
    {
      title: '故障来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      fixed: 'left',
    },
    {
      title: '系统模块',
      dataIndex: 'registerModel',
      key: 'registerModel',
      width: 150,
    },
    {
      title: '故障类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
    },
    {
      title: '工单状态',
      dataIndex: 'statuscn',
      key: 'statuscn',
      width: 120,
      // render: (text, record) => {
      //   const text1 = faultStatusmap[record.status];
      //   return text1;
      // },
    },
    {
      title: '故障名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '故障地点',
      dataIndex: 'registerAddress',
      key: 'registerAddress',
      width: 200,
    },
    {
      title: '登记人',
      dataIndex: 'registerUser',
      key: 'registerUser',
      width: 120,
    },
    {
      title: '登记人单位',
      dataIndex: 'registerUnit',
      key: 'registerUnit',
      width: 200,
    },
    {
      title: '登记人部门',
      dataIndex: 'registerDept',
      key: 'registerDept',
      width: 200,
    },
    {
      title: '审核人',
      dataIndex: 'checkUser',
      key: 'checkUser',
      width: 200,
    },
    {
      title: '审核人单位',
      dataIndex: 'checkUnit',
      key: 'checkUnit',
      width: 200,
    },
    {
      title: '审核人部门',
      dataIndex: 'checkDept',
      key: 'checkDept',
      width: 200,
    },
    {
      title: '故障处理开始时间',
      // dataIndex: 'handleStartTimeBegin',
      dataIndex: 'handleStartTime',
      key: 'handleStartTime',
      width: 200,
    },
    {
      title: '故障处理完成时间',
      // dataIndex: 'handleStartTimeEnd',
      dataIndex: 'handleEndTime',
      key: 'handleEndTime',
      width: 200,
    },
    {
      title: '故障处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 150,
      ellipsis: true,
    },
    {
      title: '处理结果',
      dataIndex: 'handleResult',
      key: 'handleResult',
      width: 120,
    },
  ];

  const getQuerylists = () => { // 列表 列表接口
    dispatch({
      type: 'fault/getfaultQueryList',
      payload: {
        current: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  }

  useEffect(() => {
    getQuerylists();
  }, []);

  const searchdata = (values, page, pageSize) => { // 查询 查询接口
    dispatch({
      type: 'fault/getTosearchfaultSearch',
      payload: {
        values,
        pageSize,
        current: page,
      },
    });
  };

  const handleReset = () => { // 重置
    resetFields();
  }

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });

    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = fieldsValue;
      if (fieldsValue.registerOccurTimeBegin) {
        values.registerOccurTimeBegin = fieldsValue.registerOccurTimeBegin.format('YYYY-MM-DD');
      }
      if (fieldsValue.registerTimeBegin) {
        values.registerTimeBegin = fieldsValue.registerTimeBegin.format('YYYY-MM-DD');
      }
      if (fieldsValue.handleStartTimeBegin) {
        values.handleStartTimeBegin = fieldsValue.handleStartTimeBegin.format('YYYY-MM-DD');
      }
      if (fieldsValue.handleStartTimeEnd) {
        values.handleStartTimeEnd = fieldsValue.handleStartTimeEnd.format('YYYY-MM-DD');
      }

      if(fieldsValue.type) {
        values.type = fieldsValue.type.join('/');
      }

      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPageinations({
      ...paginations,
      pageSize,
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
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: faultQueryList ? faultQueryList.total : '',
    onChange: page => changePage(page),
  };

  const rowSelection = {
    onChange: (selectedRows) => {
      setSelectedRow([...selectedRows]);
    },
  };

  // 批量删除
  // const handleDeleteAll = () => {
  //   if (selectedRow.length) {
  //     const ids = [];
  //     selectedRow.forEach(item => {
  //       ids.push(item);
  //     });
  //     dispatch({
  //       type: 'fault/remove',
  //       payload: { id: ids }
  //     }).then(res => {
  //       if (res.code === 200) {
  //         message.success(res.msg);
  //         getQuerylists();
  //       } else {
  //         message.error('删除失败!');
  //       }
  //     });
  //   } else {
  //     message.info('至少选择一条数据');
  //   }
  // };

  //  下载 /导出功能
  const download = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'fault/faultQuerydownload',
          payload: {
            values,
            pageSize,
            current: page,
          },
        }).then(res => {
          const filename = `下载.xlsx`;
          const url = window.URL.createObjectURL(res);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  const getTypebyTitle = (title) => {
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const faultSource = getTypebyTitle('故障来源');
  const priority = getTypebyTitle('严重程度');
  const handleResult = getTypebyTitle('故障处理结果');
  const sysmodular = getTypebyTitle('故障系统模块');
  const faultType = getTypebyTitle('故障分类');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1354278126724583426"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'non' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="故障编号">
                {getFieldDecorator('no', {})(<Input allowClear />)}
              </Form.Item>
            </Col>

            <Col xl={8} xs={12}>
              <Form.Item label="故障来源">
                {getFieldDecorator('source')(
                  <Select placeholder="请选择">
                    {faultSource.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col xl={8} xs={12}>
                  <Form.Item label="故障发生时间">
                    {getFieldDecorator('registerOccurTimeBegin', {
                    })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障登记时间">
                    {getFieldDecorator('registerTimeBegin', {
                    })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="系统模块">
                    {getFieldDecorator('registerModel')(

                      <Select placeholder="请选择">
                        {sysmodular.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障类型">
                    {getFieldDecorator('type')(
                      <Cascader
                        placeholder="请选择"
                        options={faultType}
                        fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="故障名称">
                    {getFieldDecorator('title')(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障地点">
                    {getFieldDecorator('registerAddress')(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="严重程度">
                    {getFieldDecorator('registerLevel')(
                      <Select placeholder="请选择">
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
                  <Form.Item label="登记人">
                    {getFieldDecorator('rgister_user', {
                      initialValue: '',
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="登记人单位">
                    {getFieldDecorator('registerUnit', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核人">
                    {getFieldDecorator('checkUser', {
                      initialValue: '',
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核人单位">
                    {getFieldDecorator('checkUnit', {
                      initialValue: '',
                    })(<Select />,)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障处理开始时间">
                    {getFieldDecorator('handleStartTimeBegin', {
                    })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障处理完成时间">
                    {getFieldDecorator('handleStartTimeEnd', {
                    })(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="故障处理人">
                    {getFieldDecorator('handleEnterNames', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择" />,
                    )}
                  </Form.Item>
                </Col>

                <Col xl={8} xs={12}>
                  <Form.Item label="处理结果">
                    {getFieldDecorator('handleResult', {
                      initialValue: '',
                    })(
                      <Select placeholder="请选择">
                        {handleResult.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Form.Item>
                  <Button type="primary" onClick={handleSearch}>
                    查 询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                    重 置
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="link"
                    onClick={() => {
                      setExpand(!expand);
                    }}
                  >
                    {expand ? (
                      <>
                        收起 <Icon type='up' />
                      </>
                    ) : (
                        <>
                          展开 <Icon type='down' />
                        </>
                      )}
                  </Button>
                </Form.Item>
              </Col>
            )}
            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      收起 <Icon type='up' />
                    </>
                  ) : (
                      <>
                        展开 <Icon type='down' />
                      </>
                    )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Popconfirm title="确定导出数据？" onConfirm={() => download()}>
            <Button type="primary">导出数据</Button>
          </Popconfirm>

          {/* <Popconfirm title="确定删除吗？" onConfirm={handleDeleteAll} icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}>
            <Button type="danger" style={{ marginLeft: 10 }}>批量删除</Button>
          </Popconfirm> */}
        </div>
        <Table
          loading={loading}
          columns={columns.filter(item => item.title !== 'id' || item.key !== 'id')}
          dataSource={faultQueryList && faultQueryList.rows}
          table-layout="fixed"
          rowKey={record => record.id}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 800 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ fault, loading }) => ({
    faultQueryList: fault.faultQueryList,
    html: fault.html,
    loading: loading.models.fault,
  }))(QueryList),
);