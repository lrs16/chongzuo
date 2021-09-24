import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Calendar, Icon, Card, Button, Layout, Tree, message } from 'antd';
import SettingDetails from './components/SettingDetails';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import SysDict from '@/components/SysDict';
import Dutyexcel from './components/Dutyexcel';
import { load } from 'react-cookies';

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
    dispatch,
    tableArr,
    loading
  } = props;

  const [currentmonth, setCurrentmonth] = useState(
    moment()
      .startOf('month')
      .format('YYYY-MM-DD')
      .split('-')[1],
  );
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
          result = tableArr[0] ? tableArr[0].details : [];
          break;

        // case 2:
        //   result = tableArr[1].details;
        //   break;

        // case 3:
        //   result = tableArr[2].details;
        //   break;
        // case 4:
        //   result = tableArr[3].details;
        //   break;
        // case 5:
        //   result = tableArr[4].details;
        //   break;
        // case 6:
        //   result = tableArr[5].details;
        //   break;
        // case 7:
        //   result = tableArr[6].details;
        //   break;
        // case 8:
        //   result = tableArr[7].details;
        //   break;
        // case 9:
        //   result = tableArr[8].details;
        //   break;
        // case 10:
        //   result = tableArr[9].details;
        //   break;
        // case 11:
        //   result = tableArr[10].details;
        //   break;
        // case 12:
        //   result = tableArr[11].details;
        //   break;
        // case 13:
        //   result = tableArr[12].details;
        //   break;
        // case 14:
        //   result = tableArr[13].details;
        //   break;
        // case 15:
        //   result = tableArr[14].details;
        //   break;
        // case 16:
        //   result = tableArr[15].details;
        //   break;
        // case 17:
        //   result = tableArr[16].details;
        //   break;
        // case 18:
        //   result = tableArr[17].details;
        //   break;
        // case 19:
        //   result = tableArr[18].details;
        //   break;
        // case 20:
        //   result = tableArr[19].details;
        //   break;
        // case 21:
        //   result = tableArr[20].details;
        //   break;
        // case 22:
        //   result = tableArr[21].details;
        //   break;
        // case 23:
        //   result = tableArr[22].details;
        //   break;
        // case 24:
        //   result = tableArr[23].details;
        //   break;
        // case 25:
        //   result = tableArr[24].details;
        //   break;
        // case 26:
        //   result = tableArr[25].details;
        //   break;
        // case 27:
        //   result = tableArr[26].details;
        //   break;
        // case 28:
        //   result = tableArr[27].details;
        //   break;
        // case 29:
        //   result = tableArr[28].details;
        //   break;
        // case 30:
        //   result = tableArr[29].details;
        //   break;
        // case 31:
        //   result = tableArr[30].details;
        //   break;
        default:
          break;
      }
    }
    return result;
  };


  //  年月日面板的切换
  const onPanelChange = (value, mode) => {
    // console.log('value, mode: ', value, mode);
    // console.log(value.startOf('month').format('YYYY-MM-DD HH:mm:ss')); // 开始
    // console.log(value.endOf('month').format('YYYY-MM-DD HH:mm:ss')); // 开始
    if (mode === 'month') { // 只有月支持渲染
      const changeMonth = moment(value)
        .format('YYYY-MM')
        .split('-')[1];
      //  去请求接口
      setCurrentmonth(changeMonth);
    }
  };



  const handleSelect = value => {
  };

  const handleSubmit = (newdata) => {
    if(!newdata.id) {
      return dispatch({
        type: 'dutyandtypesetting/fetchstaffAdd',
        payload: newdata
      }).then(res => {
        if (res.code === 200) {
          const currentYear = moment(new Date()).format('YYYY');
          const month = moment(new Date()).format('MM')
          getTable(currentYear, month)
          message.info(res.msg)
        }
      })
    } 

    if(newdata.id) {
      return dispatch({
        type: 'dutyandtypesetting/fetchstaffUpdata',
        payload: newdata
      }).then(res => {
        if (res.code === 200) {
          const currentYear = moment(new Date()).format('YYYY');
          const month = moment(new Date()).format('MM')
          getTable(currentYear, month)
          message.info(res.msg)
        }
      })
    } 
  
  
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
      return <TreeNode key={item.id} {...item} dataRef={item}
      />;
    });

  //  单元格渲染
  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {(listData || []).map(item => (
          <SettingDetails
            title='编辑排班信息'
            key={item.id}
            id={item.id}
            onSubmit={handleSubmit}
            groupId={item.groupId}
            // settingDetails={{
            //   params1: item.params1,
            //   params2: item.params2,
            //   params3: item.params3,
            // }}
          >
            <li key={item.id}>

              {/* <Badge status={item.type} text={item.content} /> */}
              <span>{item.staffName}</span>
            </li>
          </SettingDetails>
        ))}
      </ul>
    );
  };



  const handleClick = (selectkeys) => {
    sessionStorage.setItem('groupId', selectkeys.toString())
  }

  const getTable = (year, month) => {
    dispatch({
      type: 'dutyandtypesetting/fetchtable',
      payload: {
        year,
        month
      }
    })
  }

  useEffect(() => {
    sessionStorage.setItem('groupId', '1438060967991177218')
    const currentYear = moment(new Date()).format('YYYY');
    const month = moment(new Date()).format('MM')
    getTable(currentYear, month)
  }, [])

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');

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
              teamname && teamname.length > 0 && (
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
                    settingDetails=''
                    id=''
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
    tableArr: dutyandtypesetting.tableArr,
    loading: dutyandtypesetting.loading
  }))(DutyaccordingSetting);

