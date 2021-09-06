import React, {
  useState,
  // useEffect 
} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Divider,
  Popconfirm
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AddDutyclassesSetting from './components/AddDutyclassesSetting';

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

const enableStatus = [
  { key: '0', title: '启用' },
  { key: '1', title: '停用' },
];

const dataSource = [
  {
    'No':'No',
    't1':'t1',
    't2':'t2',
    't3':'t3',
    't4':'t4',
    't5':'t5',
  }
]

function DutyclassesSetting(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      // getFieldsValue 
    },
    // dispatch,
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const handleSearch = () => {
    console.log('查询')
  }
  const handleReset = () => {
    console.log('重置')
    resetFields();
  }

  const newclasses = () => {
    router.push({
      pathname: '/ITSM/dutymanage/dutyconfiguration/dutyclassessetting/newclasses',
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

  // useEffect(() => {
  //   // const values = getFieldsValue();
  //   dispatch({
  //     // type: '/fetchlist',
  //     // payload: {
  //     //   ...values,
  //     //   pageIndex: paginations.current - 1,
  //     //   pageSize: paginations.pageSize,
  //     // },
  //   });
  // }, []);

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  )

  const handleDelete = (deleteId) => {


  }

  const columns = [
    {
      title: '班次编号',
      dataIndex: 'No',
      key: 'No',
      // render: (text, record) => {
      //   const handleClick = () => {
      //     router.push({
      //       pathname: ``,
      //       query: {
      //         record
      //       },
      //     });
      //   };
      //   return <a onClick={handleClick}>{text}</a>;
      // },
    },
    {
      title: '创建时间',
      dataIndex: 't1',
      key: 't1',
      width: 200,
    },
    {
      title: '创建人',
      dataIndex: 't2',
      key: 't2',
    },
    {
      title: '班次名称',
      dataIndex: 't3',
      key: 't3',
    },
    {
      title: '值班时段',
      dataIndex: 't4',
      key: 't4',
    },
    {
      title: '启用状态',
      dataIndex: 't5',
      key: 't5',
    },
    {
      title: '操作',
      dataIndex: 'opertator',
      key: 'opertator',
      render: (text, record) => {
        return (
          <>
            <AddDutyclassesSetting>
              <a
                title='编辑班次'
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                onsubmit={(submitdata => handleSubmit(submitdata))}
              >
                编辑
              </a>
            </AddDutyclassesSetting>
            <Divider type='vertical' />
            <Popconfirm
              title='是否要删除该条数据' 
              onConfirm={() => handleDelete(record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        )
      }
    }
  ];

  const handleSubmit = (submitdata) => {

  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="班次编号">
                {getFieldDecorator('form1', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="创建时间" >
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time1', {
                      initialValue: undefined,
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
                      initialValue: undefined,
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
              <Form.Item label="创建人">
                {getFieldDecorator('form2', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="班次名称">
                {getFieldDecorator('form3', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="值班时段" >
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time3', {
                      initialValue: undefined,
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
                      initialValue: undefined,
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
              <Form.Item label="启用状态">
                {getFieldDecorator('form4', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {enableStatus.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right', paddingTop: 4 }}>{extra}</Col>
          </Form>
        </Row>

        {/* <div style={{ marginBottom: 24 }}>
          {/* <Button type="primary" style={{ marginRight: 8 }} onClick={() => newclasses()}>新增</Button > */}
        {/* <Button type="danger" ghost style={{ marginRight: 8 }}>删除</Button >
        </div> */}

        <AddDutyclassesSetting>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            icon='plus'
            onsubmit={(submitdata => handleSubmit(submitdata))}
          >
            新增
          </Button>
        </AddDutyclassesSetting>
        < Table
          // loading={loading}
          columns={columns}
          dataSource={dataSource}
          //  pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.No}
          scroll={{ x: 1300 }}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect()(DutyclassesSetting),
);