import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Table, Row, Form, Col, Select, Input, Button } from 'antd';
import { querkeyVal } from '@/services/api';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SettingDrawer from './components/SettingDrawer';

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

const data = [
  {
    key1: '主机巡检告警',
    key2: '主机巡检',
    key3: '巡检内容超过设定的阈值则告警',
    key4: '刘柳',
    key5: '2020-04-22 09:18:49',
  },
  {
    key1: '软件巡检告警',
    key2: '软件巡检',
    key3: '巡检内容超过设定的阈值则告警',
    key4: '刘柳',
    key5: '2020-04-22 09:18:49',
  }

]

function AlarmSetting(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, setFieldsValue, getFieldsValue },
    loading,
    list,
    dispatch,
    location,
  } = props;
  const [patrolSetting, setPatrolSeeting] = useState([]);
  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');


  useEffect(() => {
    querkeyVal('alarm', 'setting').then(res => {
      if (res.code === 200) {
        setPatrolSeeting(res.data.setting)
      }
    });
  }, []);

  const handleSearch = () => {
    console.log('111')
  }

  const handleReset = () => {
    resetFields();
  }

  const handleSubmit = () => {
    console.log('点击了提交按钮')
  }

  const columns = [
    {
      title: '告警标题',
      dataIndex: 'key1',
      key: 'key1',
      render: text => <a>{text}</a>,
    },
    {
      title: '配置项',
      dataIndex: 'key2',
      key: 'key2',
    },
    {
      title: '描述',
      dataIndex: 'key3',
      key: 'key3',
    },
    {
      title: '编辑人',
      dataIndex: 'key4',
      key: 'key4',
    },
    {
      title: '编辑时间',
      dataIndex: 'key5',
      key: 'key5',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const handleSetting = () => {
          setVisible(!visible);
          setDrawerTitle(record.key1);
        }
        return (
          <span>
            <a onClick={() => handleSetting()}>编辑配置</a>
          </span>
        )
      },
    },
  ];

  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
  </>
  );

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="配置项">
                {getFieldDecorator('releaseStatus', {
                })(
                  <Select placeholder="请选择" allowClear>
                    {patrolSetting.map(obj => (
                      <Option key={obj.key} value={obj.val}>
                        {obj.val}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="发布编号">
                {getFieldDecorator('releaseNo', {
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginTop: 4, paddingLeft: 48 }}>{extra}</Col>
          </Form>
        </Row>
        <Table columns={columns} dataSource={data} />
      </Card>
      <SettingDrawer
        visible={visible}
        title={drawerTitle}
        handleSubmit={(v) => handleSubmit(v)}
        ChangeVisible={(v) => setVisible(v)}
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releaseview, loading }) => ({
    list: releaseview.list,
    loading: loading.models.releaseview,
  }))(AlarmSetting)
);