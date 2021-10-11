import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Layout, Input, Menu, Row, Col } from 'antd';
import { querkeyVal } from '@/services/api';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import NoticTree from './components/NoticTree';
import { userList } from './services/api';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const data = [
  {
    val: '许华聪',
    key2: '广西博联信息通信技术有限责任公司',
    key: '13214576859',
    key4: '短信',
    key5: '2020-04-22 09:18:49',
    key6: '告警，确认告警，取消告警'
  },
  {
    val: '林辛',
    key2: '广西博联信息通信技术有限责任公司',
    key: '13785769440',
    key4: '短信',
    key5: '2020-04-22 09:18:49',
    key6: '确认告警，取消告警'
  },
  {
    val: '朱强生',
    key2: '广西博联信息通信技术有限责任公司',
    key: '137857694450',
    key4: '短信',
    key5: '2020-04-22 09:18:49',
    key6: '告警'
  },
]

function NoticeSetting(props) {
  const { dispatch, list } = props;
  const pagetitle = props.route.name;
  const [tabActivekey, settabActivekey] = useState('1'); // 打开标签
  const [alarmgroup, setAlarmgroup] = useState([]);
  const [visible, setVisible] = useState('');
  const [openType, setOpenType] = useState('');
  const [openKeys, setOpenKeys] = useState([]);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [selectedRowKeys, setSelectionRow] = useState([]);
  const [selectRowdata, setSelectdata] = useState([]);
  const [records, setRecords] = useState({});
  const [username, setUsername] = useState('')
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  const handleTabChange = key => {
    settabActivekey(key)
  };

  const handleSearch = (pageIndex, pageSize) => {
    dispatch({
      type: 'measuralarm/fetchtotalinfo',
      payload: { pageIndex, pageSize, username },
    });
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectRowKey, selectedRows) => {
      setSelectionRow(selectRowKey);
      setSelectdata(selectedRows);
    },
  };

  const onShowSizeChange = (page, size) => {
    handleSearch(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    handleSearch(page, paginations.pageSize);
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
    onChange: page => changePage(page),
  };

  const tabList = [
    {
      key: '1',
      tab: '告警通知组',
    },
    {
      key: '2',
      tab: '告警联系人设置',
    },
  ];
  const columns = [
    {
      title: '告警通知人',
      dataIndex: 'val',
      key: 'val',
    },
    {
      title: '所属部门',
      dataIndex: 'key2',
      key: 'key2',
    },
    {
      title: '联系电话',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '告警项',
      dataIndex: 'key6',
      key: 'key6',
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
          setOpenType('view');
          setRecords(record);
          setVisible(!visible);
        }
        return (
          <span>
            <a onClick={() => handleSetting()}>编辑</a>
          </span>
        )
      },
    },
  ];

  const onOpenChange = keys => {
    console.log(keys)
    setOpenKeys(keys)
    // const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    // if (latestOpenKey) {
    //   setOpenKeys([latestOpenKey])
    // } else {
    //   setOpenKeys([])
    // }
  };

  const handleClick = (e) => {
    console.log(e.key)
  }

  useEffect(() => {
    querkeyVal('alarm', 'notification_group').then(res => {
      if (res.code === 200) {
        const value = res.data.notification_group;
        setAlarmgroup(value)
      }
    });
  }, []);

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const measurmap = getTypebykey('1436608796393205762');          // 计量
  // const hostmap = getTypebykey('1437319207950217217');            // 主机巡检内容
  // const softmap = getTypebykey('1442405396184997889');            // 软件      
  // const appmap = getTypebykey('1437322008466026497');             // 应用程序
  // const filesmmap = getTypebykey('1442417886570639362');          // 配置文件
  // const messagermap = getTypebykey('1437584114700386305');        // 上下行报文

  // const treenodemap = new Map([
  //   ['计量业务告警', measurmap],
  //   ['主机巡检告警', hostmap],
  //   ['软件巡检告警', softmap],
  //   ['应用程序运行状态告警', appmap],
  //   ['配置文件变更告警', filesmmap],
  //   ['上下行报文页面告警', messagermap],
  // ]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      <DictLower
        typeid="1371645400838049793"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {tabActivekey === '1' && (
        <Layout style={{ position: 'relative' }}>
          <Sider
            width={250}
            style={{
              background: '#fff',
              borderRight: '1px solid #e8e8e8',
              position: 'absolute',
              left: 0,
              height: 'calc(100% - 24px)',
              overflow: 'auto'
            }}
          >
            <h3 style={{ padding: '18px 0 18px 24px', borderBottom: '1px solid #e8e8e8', fontWeight: 700 }}>告警通知组</h3>
            <Menu
              onClick={handleClick}
              style={{ marginRight: '-1px' }}
              mode="inline"
              openKeys={openKeys}
              onOpenChange={onOpenChange}
            >
              {alarmgroup && alarmgroup.map(({ key, val }) => {
                if (key === '001') {
                  return (
                    <SubMenu key={key} title={val}>
                      {measurmap.map(item => [
                        <SubMenu key={`${key}_${item.dict_code}`} title={item.title}>
                          <Menu.Item key={`${key}_${item.dict_code}_1`} value={`${key}_${item.dict_code}_1`}>告警</Menu.Item>
                          <Menu.Item key={`${key}_${item.dict_code}_2`} value={`${key}_${item.dict_code}_2`}>确认告警</Menu.Item>
                          <Menu.Item key={`${key}_${item.dict_code}_3`} value={`${key}_${item.dict_code}_3`}>告警消除</Menu.Item>
                        </SubMenu>
                      ])}
                    </SubMenu>)
                }
                return (
                  <SubMenu key={key} title={val}>
                    <Menu.Item key={`${val}_1`} value={`${val}_1`}>告警</Menu.Item>
                    <Menu.Item key={`${val}_2`} value={`${val}_2`}>确认告警</Menu.Item>
                    <Menu.Item key={`${val}_3`} value={`${val}_3`}>告警消除</Menu.Item>
                  </SubMenu>)
              })}
            </Menu>
          </Sider>
          <Content style={{ marginLeft: 274 }}>
            <Card bordered={false}>
              <Table columns={columns} dataSource={data} />
            </Card>
          </Content>
        </Layout>
      )}
      {tabActivekey === '2' && (
        <Card>
          <Row>
            <Col span={16}>
              <Button
                style={{ marginBottom: 8, marginRight: 8 }}
                type="primary"
                onClick={() => { setVisible(!visible); setOpenType('new') }}>新增
              </Button>
              <Button
                style={{ marginBottom: 8, }}
                type="danger"
                ghost
                onClick={() => { setVisible(!visible); setOpenType('new') }}>删除
              </Button>
            </Col>
            <Col span={8}>
              <Search placeholder="请输入关键字" onSearch={values => { setUsername(values); handleSearch(1, 15) }} />
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={data}
            rowSelection={rowSelection}
            pagination={pagination}
          />
        </Card>
      )}
      <NoticTree
        visible={visible}
        ChangeVisible={(v) => setVisible(v)}
        openType={openType}
        alarmgroup={alarmgroup}
        selectdata={selectdata}
        record={records}
      />
    </PageHeaderWrapper >
  );
}

export default connect(({ noticesetting, loading }) => ({
  list: noticesetting.list,
  loading: loading.models.noticesetting,
}))(NoticeSetting);