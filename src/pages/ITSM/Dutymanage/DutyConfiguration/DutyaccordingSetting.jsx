import React, { useState } from 'react';
import {
  Calendar,
  Badge,
  Card,
  Button,
  Layout,
  Tree,
  message,
} from 'antd';
import SettingDetails from './components/SettingDetails';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

const { Sider, Content } = Layout;
const { TreeNode } = Tree;
const calenData = [
  [
    { type: 'warning', content: '张三(早班)', params1: 1, params2: 2, params3: 3, },
    { type: 'success', content: '李四(中班)' },
  ],

  [
    { type: 'warning', content: '小红(晚班)' },
    { type: 'success', content: '小明(行政班)' },
    { type: 'error', content: '小蓝(早班)' },
  ],
  [
    { type: 'warning', content: '小绿(中班)' },
    { type: 'success', content: '美团(行政班)' },
    { type: 'error', content: '支付宝(早班)' },
    { type: 'error', content: '微信(晚班)' },
    { type: 'error', content: '花呗(行政班)' },
    { type: 'error', content: '余额宝(早班)' },
  ]
]



function DutyaccordingSetting(props) {
  const pagetitle = props.route.name;

  const [currentmonth,setCurrentmonth] = useState(((moment().startOf('month').format("YYYY-MM-DD")).split('-'))[1])
  console.log('currentmonth: ', currentmonth);

  const getListData = (value) => {
    let result;
    const getCurrentmonth = ((moment(value).format('YYYY-MM-DD')).split('-'))[1]
    if( getCurrentmonth === currentmonth) {
      switch (value.date()) {
        case 1:
          result = calenData[0]
          break;
  
        case 2:
          result = calenData[1]
          break;
  
        case 3:
          result = result = calenData[2]
          break;
        default:
          break;
      }
    }
    return result || [];
}

  //  年月日面板的切换
  const onPanelChange = (value, mode) => {
    console.log(moment(value).format('YYYY-MM'))
    const changeMonth = ((moment(value).format('YYYY-MM')).split('-'))[1];
    setCurrentmonth(changeMonth)
  }

  const getdetail = (params1, params2, params3) => {
    console.log('params1,params2,params3: ', params1, params2, params3);
  }

  const toggleHover = () => {
    setInitialhover(!initialhover)
  }

  //  单元格渲染
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <SettingDetails
            settingDetailsparams={{ params1: item.params1, params2: item.params2, params3: item.params3 }}
          >
            <li key={item.content}
              id='lievent'
            // onClick={() => { getdetail(item.params1, item.params2, item.params3,) }}
            // onMouseEnter={toggleHover}
            // onMouseLeave={toggleHover}
            // style={linkStyle || {fontSize:16}}
            // onMouseOver = {() =>backcolor() }
            // onFocus={() => 0}
            >
              <Badge status={item.type} text={item.content} />
            </li>
          </SettingDetails>
        ))}
      </ul>
    );
  }
  return (
    <PageHeaderWrapper title={pagetitle}>

      <Card>
        <Layout>
          <Sider theme='light'>
            ff
          </Sider>

          <Content>
            <div style={{ backgroundColor: 'white', paddingBottom: 7 }}>
              <Button type='primary' style={{ marginRight: 8 }}>新增</Button>
              <Button type='primary' style={{ marginRight: 8 }}>下载导入模板</Button>
              <Button type='primary' style={{ marginRight: 8 }}>导入</Button>
              <Button type='primary' style={{ marginRight: 8 }}>导出</Button>
              <Button type='danger' ghost >删除</Button>

            </div>

            <div style={{ backgroundColor: 'white' }}>行政班:（09:00-17:30 ）   早班:（ 09:00-16:00   ） 中班:（16:00-22:00）  晚班:（22:00-次09:00）</div>

            <Card>

              <Calendar
                onPanelChange={onPanelChange}
                dateCellRender={dateCellRender}
                shownextprevmonth={false}
              />
            </Card>

          </Content>
        </Layout>

      </Card>
    </PageHeaderWrapper>
  )
}

export default DutyaccordingSetting;