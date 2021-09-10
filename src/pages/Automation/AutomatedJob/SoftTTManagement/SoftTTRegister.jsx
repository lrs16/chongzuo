import React, {
  // useEffect,
  useState
} from 'react';
// import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Table, Card, Button, Form, Input, Select, Row, Col, DatePicker, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DictLower from '@/components/SysDict/DictLower';

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

const colormap = new Map([
  ['停用', 'error'],
  ['在用', 'success'],
]);

function SoftTTRegister(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    // location,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    },
  } = props;

  const [expand, setExpand] = useState(false);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    // values.startTime = values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
    // values.endTime = values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
    // values.startUpdateTime = values.startUpdateTime ? moment(values.startUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    // values.endUpdateTime = values.endUpdateTime ? moment(values.endUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    dispatch({
      type: 'xxx',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  // useEffect(() => {
  //   searchdata(1, 15);
  // }, [location]);

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const newRegist = (edittype, record) => {
    if (edittype === 'edit') {
      router.push({
        pathname: '/automation/automatedjob/softstartandstop/softregister/newregist',
        query: {
          Id: record.id,
        },
        state: {
          dynamicpath: true,
          menuDesc: '编辑启停登记',
        }
      })
    } else {
      router.push({
        pathname: '/automation/automatedjob/softstartandstop/softregister/newregist',
        query: {
          addtab: true,
          menuDesc: '启停登记',
        },
      })
    }
  }

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
    total: 10,
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
      title: '区域',
      dataIndex: 'hostZoneId',
      key: 'hostZoneId',
      width: 120,
    },
    {
      title: '主机名称',
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
      title: '软件名称',
      dataIndex: 'softName',
      key: 'softName',
      width: 180,
    },
    {
      title: '软件端口',
      dataIndex: 'softPort',
      key: 'softPort',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 180,
    },
    {
      title: '审核结果',
      dataIndex: 'checkResults',
      key: 'checkResults',
      width: 180,
    },
    {
      title: '软件路径',
      dataIndex: 'softPath',
      key: 'softPath',
      width: 180,
    },
    {
      title: '软件版本号',
      dataIndex: 'softVersion',
      key: 'softVersion',
      width: 180,
    },
    {
      title: '软件状态',
      dataIndex: 'softStatus',
      key: 'softStatus',
      width: 180,
      render: (text, record) => (
        <span>
          <Badge status={colormap.get(record.softStatus)} text={text} />
        </span>
      ),
    },
    {
      title: '软件备注',
      dataIndex: 'softRemarks',
      key: 'softRemarks',
      width: 250,
    },
    {
      title: '启停申请说明',
      dataIndex: 'content',
      key: 'content',
      width: 250,
    },
    {
      title: '启停申请人',
      dataIndex: 'person',
      key: 'person',
      width: 180,
    },
    {
      title: '启停申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 250,
    },
    {
      title: '审核人',
      dataIndex: 'checker',
      key: 'checker',
      width: 120,
    },
    {
      title: '审核时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 250,
    },
    {
      title: '审核说明',
      dataIndex: 'checkContent',
      key: 'checkContent',
      width: 250,
    },
    {
      title: '审核单位',
      dataIndex: 'checkUnit',
      key: 'checkUnit',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: () => {
        return (
          <div>
            <a type="link"
            >
              编辑启停信息
            </a>
          </div>
        );
      },
    },
  ];

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const zonemap = getTypebyId('1428182995477942274'); // 区域
  const statusmap = [];
  const checkresultsmap = [];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="1428178684907835393"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
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
              <Form.Item label="主机名称">
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
                  <Form.Item label="软件名称">
                    {getFieldDecorator('softName', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="状态">
                    {getFieldDecorator('status', {
                      initialValue: '',
                    })(<Select placeholder="请选择" allowClear>
                      {statusmap.map(obj => (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="软件端口">
                    {getFieldDecorator('softPort', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="软件路径">
                    {getFieldDecorator('softPath', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核结果">
                    {getFieldDecorator('checkResults', {
                      initialValue: '',
                    })(<Select placeholder="请选择" allowClear>
                      {checkresultsmap.map(obj => (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核人">
                    {getFieldDecorator('checker', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="审核时间">
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('startcheckTime', {})(
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
                        {getFieldDecorator('endcheckTime', {})(
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
                  <Form.Item label="启停申请人">
                    {getFieldDecorator('person', {
                      initialValue: '',
                    })(<Input placeholder="请输入" allowClear />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="启停申请时间">
                    <Row>
                      <Col span={11}>
                        {getFieldDecorator('startApplyTime', {})(
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
                        {getFieldDecorator('endApplyTime', {})(
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
            onClick={() => newRegist()}
          >登记</Button>
        </div>
        <Table
          columns={columns}
          // dataSource={}
          // loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1300 }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(SoftTTRegister);