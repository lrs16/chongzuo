import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Layout, Input, Menu, Row, Col, Divider, message } from 'antd';
import { querkeyVal } from '@/services/api';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import NoticTree from './components/NoticTree';
import { delUser } from './services/api';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

function NoticeSetting(props) {
  const { dispatch, list, loading } = props;
  const pagetitle = props.route.name;
  const [tabActivekey, settabActivekey] = useState('2'); // 打开标签
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

  const handleSearch = (pageIndex, pageSize, val) => {
    dispatch({
      type: 'noticesetting/fetchlist',
      payload: {
        pageIndex,
        pageSize,
        username: val === undefined ? username : val
      },
    });
  };

  const handleDelids = () => {
    delUser({ id: selectedRowKeys.toString() }).then(res => {
      console.log(res)
    })
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
    // {
    //   key: '1',
    //   tab: '告警通知组',
    // },
    {
      key: '2',
      tab: '告警联系人设置',
    },
  ];
  const columns = [
    {
      title: '告警通知人',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '所属部门',
      dataIndex: 'userDept',
      key: 'userDept',
    },
    {
      title: '联系电话',
      dataIndex: 'tel',
      key: 'tel',
    },
    // {
    //   title: '告警项',
    //   dataIndex: 'key6',
    //   key: 'key6',
    // },
    // {
    //   title: '通知方式',
    //   dataIndex: 'key4',
    //   key: 'key4',
    // },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const handleSetting = () => {
          setOpenType('view');
          setRecords(record);
          setVisible(!visible);
        };
        const handleDel = () => {
          delUser({ id: record.id }).then(res => {
            if (res.code === 200) {
              message.success('操作成功！');
              handleSearch(1, 15)
            } else {
              message.error('操作失败！');
            }
          })
        }
        return (
          <span>
            <a onClick={() => handleSetting()}>编辑</a>
            <Divider type='vertical' />
            <a onClick={() => handleDel()}>删除</a>
          </span>
        )
      },
    },
  ];

  const onOpenChange = keys => {
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
    handleSearch(1, 15)
  }, []);

  const getTypebykey = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const measurmap = getTypebykey(899);          // 计量
  // const hostmap = getTypebykey(932);            // 主机巡检内容
  // const softmap = getTypebykey(965);            // 软件      
  // const appmap = getTypebykey(938);             // 应用程序
  // const filesmmap = getTypebykey(973);          // 配置文件
  // const messagermap = getTypebykey(950);        // 上下行报文

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
        typeid="438"
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
              <Table columns={columns} dataSource={[]} />
            </Card>
          </Content>
        </Layout>
      )}
      {tabActivekey === '2' && (
        <Card>
          <Row>
            <Col span={8} offset={16}>
              <Search
                placeholder="请输入关键字"
                onSearch={values => { setUsername(values); handleSearch(1, 15, values) }}
              />
            </Col>
            <Col span={24}>
              <Button
                style={{ marginBottom: 8, marginTop: 8 }}
                type="dashed"
                icon="plus"
                block
                onClick={() => { setVisible(!visible); setOpenType('new'); setRecords({}) }}>新增联系人
              </Button>
              {/* <Button
                style={{ marginBottom: 8, }}
                type="danger"
                ghost
                onClick={() => { handleDelids() }}
                disabled={!(selectedRowKeys.length > 0)}
              >
                删除
              </Button> */}
            </Col>
          </Row>
          <Table
            loading={loading}
            columns={columns}
            dataSource={list.records || []}
            rowKey={record => record.id}
            // rowSelection={rowSelection}
            pagination={pagination}
          />
        </Card>
      )}
      <NoticTree
        visible={visible}
        ChangeVisible={(v) => { setVisible(v); handleSearch(1, 15) }}
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