import React, { useState } from 'react';
import { connect } from 'dva';
import { Card, Table, Row, Form, Col, Select, Input, Button, Layout, Divider } from 'antd';
import { querkeyVal } from '@/services/api';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Sider, Content } = Layout;
const data = [
  {
    key1: '许华聪',
    key2: '广西博联信息通信技术有限责任公司',
    key3: '13214576859',
    key4: '短信',
    key5: '2020-04-22 09:18:49',
  },
  {
    key1: '林辛',
    key2: '广西博联信息通信技术有限责任公司',
    key3: '13785769440',
    key4: '短信',
    key5: '2020-04-22 09:18:49',
  }

]

function NoticeSetting(props) {
  const { dispatch } = props;
  const pagetitle = props.route.name;
  const [tabActivekey, settabActivekey] = useState('1'); // 打开标签

  const handleTabChange = key => {
    settabActivekey(key)
  };
  const tabList = [
    {
      key: '1',
      tab: '告警通知组设置',
    },
    {
      key: '2',
      tab: '告警联系人设置',
    },
  ];
  const columns = [
    {
      title: '告警通知人',
      dataIndex: 'key1',
      key: 'key1',
    },
    {
      title: '所属部门',
      dataIndex: 'key2',
      key: 'key2',
    },
    {
      title: '联系电话',
      dataIndex: 'key3',
      key: 'key3',
    },
    {
      title: '通知方式',
      dataIndex: 'key4',
      key: 'key4',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const handleSetting = () => {
          // setVisible(!visible);
          // setDrawerTitle(record.key1);
          console.log('点击')
        }
        return (
          <span>
            <a onClick={() => handleSetting()}>编辑</a>
            <Divider type='vertical' />
            <a onClick={() => handleSetting()}>删除</a>
            <Divider type='vertical' />
            <a onClick={() => handleSetting()}>查看详情</a>
          </span>
        )
      },
    },
  ];

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >

      {tabActivekey === '1' && (
        <Layout>
          <Sider width={250} style={{ background: '#fff', padding: '24px', }}>
            <Button style={{ marginBottom: 8 }} type="dashed" icon="plus" block>创建通知组</Button>
          </Sider>
          <Content style={{ paddingLeft: 24 }}>
            <Card bordered={false}>
              <Button style={{ marginBottom: 8 }} type="dashed" icon="plus" block>新增联系人</Button>
              <Table columns={columns} dataSource={data} />
            </Card>
          </Content>
        </Layout>
      )}
      {tabActivekey === '2' && (
        <Card>
          <Button style={{ marginBottom: 8 }} type="dashed" icon="plus" block>新增联系人</Button>
          <Table columns={columns} dataSource={data} />
        </Card>
      )}
    </PageHeaderWrapper >
  );
}

export default NoticeSetting;