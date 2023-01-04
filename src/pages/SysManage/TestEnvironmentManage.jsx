import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Button, Message, Popconfirm, Form, Input, Col, Row, Switch, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TestEnvironmentDrawer from './components/TestEnvironmentDrawer';

const { Option } = Select;

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

function TestEnvironmentManage(props) {
  const pagetitle = props.route.name;
  const { dispatch, list, loading,
    form: { getFieldDecorator, validateFields, resetFields },
  } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const getdatas = () => {
    dispatch({
      type: 'testenvironment/query',
      payload: {
        deployApp: '',
        deviceConfig: '',
        deviceName: '',
        pageIndex: 1,
        pageSize: 15,
      },
    });
  };

  useEffect(() => {
    getdatas();
  }, []);

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'testenvironment/query',
      payload: {
        ...values,
        pageIndex: page,
        pageSize: size,
      },
    });
  };

  const handleShowDrawer = (drwertitle, type, record) => {
    setVisible(!visible);
    setTitle(drwertitle);
    setSaveType(type);
    setData(record);
  };

  // 提交
  const handleSubmit = values => {
    dispatch({
      type: 'testenvironment/save',
      payload: {
        ...values,
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        validateFields((err, val) => {
          if (!err) {
            searchdata(val, paginations.current, paginations.pageSize);
          }
        });
      } else {
        Message.error(res.msg);
      }
    });
  };

  // 删除
  const handleDelete = ids => {
    dispatch({
      type: 'testenvironment/delete',
      payload: { ids },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        validateFields((err, val) => {
          if (!err) {
            searchdata(val, paginations.current, paginations.pageSize);
          }
        });
      } else {
        Message.error(res.msg);
      }
    });
  };

  const handleSwitch = (checked, values) => {
    dispatch({
      type: 'testenvironment/save',
      payload: {
        ...values,
        useStatus: checked ? 'Y' : 'N',
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        validateFields((err, val) => {
          if (!err) {
            searchdata(val, paginations.current, paginations.pageSize);
          }
        });
      } else {
        Message.error(res.msg);
      }
    });
  }


  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, 1, size);
      }
    });
    setPageinations({
      ...paginations,
      current: 1,
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
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      searchdata(values, 1, 15);
    });
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '设备名称及用途',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备型号配置',
      dataIndex: 'deviceConfig',
      key: 'deviceConfig',
      render: (text) => {
        return (<span dangerouslySetInnerHTML={{ __html: text?.replace(/[\n]/g, '<br/>') }} />)
      }
    },
    {
      title: '部署应用',
      dataIndex: 'deployApp',
      key: 'deployApp',
      render: (text) => {
        return (<span dangerouslySetInnerHTML={{ __html: text?.replace(/[\n]/g, '<br/>') }} />)
      }
    },
    {
      title: '启用状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      render: (text, r) => {
        const statumap = new Map([
          ['Y', '启用'],
          ['N', '停用'],
        ]);
        return (<Switch checkedChildren={statumap.get(text)} unCheckedChildren="停用" defaultChecked onChange={(v) => { handleSwitch(v, r) }} />)
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowDrawer('编辑测试环境', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除该测试环境吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Form {...formItemLayout}>
          <Row>
            <Col span={7}>
              <Form.Item label="设备名称及用途">
                {getFieldDecorator('deviceName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="设备型号配置">
                {getFieldDecorator('deviceConfig', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="部署应用">
                {getFieldDecorator('deployApp', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="是否启用">
                {getFieldDecorator('deployApp', {
                  initialValue: '',
                })(
                  <Select allowClear>
                    <Option value="Y">启用</Option>
                    <Option value="U">停用</Option>
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={3} style={{ paddingTop: 4, textAlign: 'right' }}>
              <Button type='primary' style={{ marginRight: 8 }} onClick={() => handleSearch()}>查询</Button>
              <Button>重置</Button>
            </Col>
          </Row>
        </Form>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={() => handleShowDrawer('新建测试环境', 'save')}
        >
          新建测试环境
        </Button>
        <Table
          columns={columns}
          dataSource={list.data}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
      {/* 抽屉 */}
      <TestEnvironmentDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        destroyOnClose
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ testenvironment, loading }) => ({
    list: testenvironment.list,
    loading: loading.models.testenvironment,
  }))(TestEnvironmentManage),
);