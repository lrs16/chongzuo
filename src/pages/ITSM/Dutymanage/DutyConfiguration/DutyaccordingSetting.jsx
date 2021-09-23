import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Calendar, Icon, Card, Button, Layout, Tree, message } from 'antd';
import SettingDetails from './components/SettingDetails';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import SysDict from '@/components/SysDict';
import Dutyexcel from './components/Dutyexcel';

const { Sider, Content } = Layout;
const { TreeNode } = Tree;
const calenData = [
  [
    { type: 'warning', content: '张三(早班)', params1: 1, params2: 2, params3: 3 },
    { type: 'success', content: '李四(中班)' },
    { type: 'success', content: '王五(夜班)' },
    { type: 'success', content: '小明(行政班班)' },
  ],

  [
    { type: 'warning', content: '张三(早班)', params1: 1, params2: 2, params3: 3 },
    { type: 'success', content: '李四(中班)' },
    { type: 'success', content: '王五(夜班)' },
    { type: 'success', content: '小明(行政班班)' },
  ],
  [
    { type: 'warning', content: '张三(早班)', params1: 1, params2: 2, params3: 3 },
    { type: 'success', content: '李四(中班)' },
    { type: 'success', content: '王五(夜班)' },
    { type: 'success', content: '小明(行政班班)' },
    // { type: 'warning', content: '小绿(早班)' },
    // { type: 'success', content: '美团(中班)' },
    // { type: 'error', content: '支付宝(夜班)' },
    // { type: 'error', content: '微信(行政班班)' },
    // { type: 'error', content: '花呗(行政班班)' },
    // { type: 'error', content: '余额宝(行政班班)' },
  ],
];

function DutyaccordingSetting(props) {
  const pagetitle = props.route.name;
  const {
    dispatch
  } = props;

  const [currentmonth, setCurrentmonth] = useState(
    moment()
      .startOf('month')
      .format('YYYY-MM-DD')
      .split('-')[1],
  );
  const [currentTime, setCurrentTime] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState('');

  const getListData = value => {
    let result;
    const getCurrentmonth = moment(value)
      .format('YYYY-MM-DD')
      .split('-')[1];
    if (getCurrentmonth === currentmonth) {
      switch (value.date()) {
        case 1:
          result = calenData[0];
          break;

        case 2:
          result = calenData[1];
          break;

        case 3:
          result = result = calenData[2];
          break;
        default:
          break;
      }
    }
    return result || [];
  };

  //  年月日面板的切换
  const onPanelChange = (value, mode) => {
    console.log(value.startOf('month').format('YYYY-MM-DD HH:mm:ss')); // 开始
    console.log(value.endOf('month').format('YYYY-MM-DD HH:mm:ss')); // 开始
    if (mode === 'month') { // 只有月支持渲染
      const changeMonth = moment(value)
        .format('YYYY-MM')
        .split('-')[1];
      //  去请求接口
      setCurrentmonth(changeMonth);
    }
  };



  const handleSelect = value => {
    console.log('value: ', value);
  };

  const handleSubmit = (newdata) => {
    return dispatch({
      type: 'dutyandtypesetting/fetchstaffAdd',
      payload: newdata
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg)
      }
    })
  }

  //  渲染树结构
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode icon={<Icon type="smile-o" />} key={item.id} {...item} dataRef={item} />;
    });

  //  单元格渲染
  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {(listData || []).map(item => (
          <SettingDetails
            title='编辑排班信息'
            key={item.content}
            settingDetailsparams={{
              params1: item.params1,
              params2: item.params2,
              params3: item.params3,
            }}
          >
            <li key={item.content}>

              {/* <Badge status={item.type} text={item.content} /> */}
              <span>{item.content}</span>
            </li>
          </SettingDetails>
        ))}
      </ul>
    );
  };

  const handleClick = (selectkeys) => {
    console.log('selectkeys: ', selectkeys);
    sessionStorage.setItem('groupId',selectkeys.toString())
  }

  useEffect(() => {
    sessionStorage.setItem('groupId','1438060967991177218')
  },[])

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');
  console.log('teamname: ', teamname);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1438058740916416514"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Layout>
        <Card title='所属班组'>
          <Sider theme="light">
            {
              teamname && teamname.length >0  && (
                <Tree
                  defaultSelectedKeys={['1438060967991177218']}
                  onSelect={handleClick}
                  defaultExpandAll
                >
                  {renderTreeNodes(teamname)}
                </Tree>
              )
            }

          </Sider>
        </Card>

        <Card style={{ marginLeft: 10 }}>
          <Content >
            {
              pagetitle === '排班设置' && (
                <div style={{ backgroundColor: 'white', paddingBottom: 7 }}>
                  <SettingDetails
                    title='新增排班信息'
                    onSubmit={handleSubmit}
                  >
                    <Button type="primary" style={{ marginRight: 8 }}>
                      新增
                    </Button>
                  </SettingDetails>

                  <Button type="primary" style={{ marginRight: 8 }}>
                    下载导入模板
                  </Button>

                  <Button type="primary" style={{ marginRight: 8 }}>
                    导出
                  </Button>

                  <Dutyexcel
                    fileslist={[]}
                    ChangeFileslist={newvalue => setFiles(newvalue)}
                  />


                  {/* <Button type="danger" ghost>
                    删除
                  </Button> */}
                </div>
              )
            }

            <div style={{ backgroundColor: 'white' }}>
              行政班:（09:00-17:30 ） 早班:（ 09:00-16:00 ） 中班:（16:00-22:00）
              晚班:（22:00-次09:00）
            </div>

            <Card>
              <Calendar
                onPanelChange={onPanelChange}
                dateCellRender={dateCellRender}
                onSelect={handleSelect}
                shownextprevmonth={false}
              />
            </Card>
          </Content>

        </Card>



      </Layout>
    </PageHeaderWrapper>
  );
}

export default
  connect(({ dutyandtypesetting, loading }) => ({
    loading: dutyandtypesetting.loading
  }))(DutyaccordingSetting);

