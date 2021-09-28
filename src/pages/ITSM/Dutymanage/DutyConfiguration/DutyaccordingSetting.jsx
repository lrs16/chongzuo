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
  const [currentMode, setCurrentMode] = useState(moment(new Date()).format('YYYY'))
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [selectdata, setSelectData] = useState('');
  const [tabledata, setTabledata] = useState([]);
  const [currentYear, setCurrentYear] = useState(moment(new Date()).format('YYYY'));
  const [month, setMonth] = useState(moment(new Date()).format('MM'));
  const [groupName, setGroupName] = useState('计量中心组');
  const getTable = (year, paramsmonth) => {
    dispatch({
      type: 'dutyandtypesetting/fetchtable',
      payload: {
        year,
        month: paramsmonth
      }
    })
  }

  const getListData = value => {
    let result;
    const getCurrentmonth = moment(value)
      .format('YYYY-MM-DD')
      .split('-')[1];
    if (loading === false && getCurrentmonth === currentmonth && tableArr && tableArr.length > 0) {
      switch (value.date()) {
        case 1:
          result = tableArr[0].details;
          break;

        case 2:
          result = tableArr[1].details;
          break;

        case 3:
          result = tableArr[2].details;
          break;
        case 4:
          result = tableArr[3].details;
          break;
        case 5:
          result = tableArr[4].details;
          break;
        case 6:
          result = tableArr[5].details;
          break;
        case 7:
          result = tableArr[6].details;
          break;
        case 8:
          result = tableArr[7].details;
          break;
        case 9:
          result = tableArr[8].details;
          break;
        case 10:
          result = tableArr[9].details;
          break;
        case 11:
          result = tableArr[10].details;
          break;
        case 12:
          result = tableArr[11].details;
          break;
        case 13:
          result = tableArr[12].details;
          break;
        case 14:
          result = tableArr[13].details;
          break;
        case 15:
          result = tableArr[14].details;
          break;
        case 16:
          result = tableArr[15].details;
          break;
        case 17:
          result = tableArr[16].details;
          break;
        case 18:
          result = tableArr[17].details;
          break;
        case 19:
          result = tableArr[18].details;
          break;
        case 20:
          result = tableArr[19].details;
          break;
        case 21:
          result = tableArr[20].details;
          break;
        case 22:
          result = tableArr[21].details;
          break;
        case 23:
          result = tableArr[22].details;
          break;
        case 24:
          result = tableArr[23].details;
          break;
        case 25:
          result = tableArr[24].details;
          break;
        case 26:
          result = tableArr[25].details;
          break;
        case 27:
          result = tableArr[26].details;
          break;
        case 28:
          result = tableArr[27].details;
          break;
        case 29:
          result = tableArr[28].details;
          break;
        case 30:
          result = tableArr[29].details;
          break;
        case 31:
          result = tableArr[30].details;
          break;
        default:
          break;
      }
    }
    return result;
  };

  //  年月日面板的切换
  const onPanelChange = (value, mode) => {
    const nowYear = moment(value).format('YYYY');
    if (mode === 'month') { // 只有月支持渲染
      const changeMonth = moment(value)
        .format('YYYY-MM')
        .split('-')[1];
      //  去请求接口
      getTable(nowYear, changeMonth)
      setCurrentmonth(changeMonth);
      setCurrentYear(nowYear);
      setMonth(changeMonth);
      setCurrentMode(nowYear)
    }
  };



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
            getTable={getTable}
            groupId={item.groupId}
            month={month}
            currentYear={currentYear}
            pagetitle={pagetitle}
          >
            <li key={item.id}>
              <span>{item.staffName + '(' + item.shiftType + ')'}</span>
            </li>
          </SettingDetails>
        ))}
      </ul>
    );
  };

  const handleClick = (selectkeys, event) => {
    console.log('event: ', event);
    const { props: { title } } = event.selectedNodes[0];
    console.log('title: ', title);
    sessionStorage.setItem('groupId', selectkeys.toString())
    getTable(currentYear, month)
  }

  const handleDelete = () => {
    return dispatch({
      type: 'dutyandtypesetting/fetchDelmonth',
      payload: {
        year: currentMode,
        month: currentmonth
      }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg)
        getTable(currentYear, month)
      }
    })
  }

  useEffect(() => {
    if (files.ischange) {
      getTable(currentYear, month)
    }
  }, [files])

  const download = () => {
    dispatch({
      type: 'dutyandtypesetting/fetchTemplate',
    }).then(res => {
      const filename = '下载.xls';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url)
    })
  }

  const handlePrint = () => {
    const newstr = document.getElementById('calendar').innerHTML;
    document.body.innerHTML = newstr;
    window.print();
    return false
  }


  useEffect(() => {
    sessionStorage.setItem('groupId', '1438060967991177218')
    getTable(currentYear, month)
  }, [])

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');

  useEffect(() => {
    const resutlteam = [{ title: '班组信息', children: teamname }]
    setTabledata(resutlteam)
  }, [teamname])

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1438058740916416514"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <>
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
                    {renderTreeNodes(tabledata)}
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
                    <Button
                      type="danger"
                      style={{ marginRight: 8 }}
                      ghost
                      onClick={handleDelete}
                    >
                      删除
                    </Button>

                    <SettingDetails
                      title='新增排班信息'
                      settingDetails=''
                      id=''
                      groupId={sessionStorage.getItem('groupId')}
                      groupName={groupName}
                      month={month}
                      currentYear={currentYear}
                      getTable={getTable}
                    >
                      <Button type="primary" style={{ marginRight: 8 }}>
                        新增
                      </Button>
                    </SettingDetails>

                    <Button
                      type="primary"
                      style={{ marginRight: 8 }}
                      onClick={download}
                    >
                      下载导入模板
                    </Button>

                    <Button
                      type="primary"
                      style={{ marginRight: 8 }}
                      onClick={handlePrint}
                    >
                      导出
                    </Button>

                    {loading === false && (
                      <Dutyexcel
                        fileslist={[]}
                        ChangeFileslist={newvalue => setFiles(newvalue)}
                      />
                    )}
                  </div>
                )
              }

              <div style={{ backgroundColor: 'white' }}>
                行政班:（09:00-17:30 ） 早班:（ 09:00-16:00 ） 中班:（16:00-22:00）
                晚班:（22:00-次09:00）
              </div>

              <Card id='calendar'>
                <Calendar
                  onPanelChange={onPanelChange}
                  dateCellRender={dateCellRender}
                  shownextprevmonth={false}
                />
              </Card>
            </Content>
          </Card>
        </Layout>

      </>
    </PageHeaderWrapper>
  );
}

export default
  connect(({ dutyandtypesetting, loading }) => ({
    tableArr: dutyandtypesetting.tableArr,
    loading: loading.models.dutyandtypesetting
  }))(DutyaccordingSetting);

