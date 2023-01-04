import React, { useEffect, useState } from 'react';
import { Card, Table, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SettingDrawer from './components/SettingDrawer';
import { thresholdList, configureList } from './services/api';


function AlarmSetting(props) {
  const pagetitle = props.route.name;

  const [visible, setVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [list, setList] = useState([]);
  const [configList, setConfigList] = useState([]);

  useEffect(() => {
    thresholdList().then(res => {
      if (res.code === 200) {
        setList(res.data)
      }
    });
  }, []);

  const columns = [
    {
      title: '告警标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '配置项',
      dataIndex: 'configurationItem',
      key: 'configurationItem',
    },
    {
      title: '描述',
      dataIndex: 'content',
      key: 'content',
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
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const handleSetting = () => {
          setVisible(!visible);
          setDrawerTitle(record.key1);
          configureList(record.id).then(res => {
            if (res.code === 200) {
              setConfigList(res.data)
            }
          })
        }
        return (
          <span>
            <a onClick={() => handleSetting()}>编辑配置</a>
          </span>
        )
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Spin spinning={list && list.length === 0}>
          <Table columns={columns} dataSource={list} rowKey={record => record.id} pagination={false} />
        </Spin>
      </Card>
      <SettingDrawer
        visible={visible}
        title={drawerTitle}
        ChangeVisible={(v) => setVisible(v)}
        configList={configList}
      />
    </PageHeaderWrapper>
  );
}

export default AlarmSetting;