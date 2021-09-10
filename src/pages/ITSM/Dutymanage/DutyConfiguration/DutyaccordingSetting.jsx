import React, { useState } from 'react';
import { Calendar, Badge, Card, Button, Layout, Tree, message } from 'antd';
import SettingDetails from './components/SettingDetails';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

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

  const [currentmonth, setCurrentmonth] = useState(
    moment()
      .startOf('month')
      .format('YYYY-MM-DD')
      .split('-')[1],
  );
  const [currentTime, setCurrentTime] = useState('');

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

  //  单元格渲染
  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {(listData || []).map(item => (
          <SettingDetails
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
  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Layout>
          <Sider theme="light">ff</Sider>

          <Content>
            <div style={{ backgroundColor: 'white', paddingBottom: 7 }}>
              <Button type="primary" style={{ marginRight: 8 }}>
                新增
              </Button>
              <Button type="primary" style={{ marginRight: 8 }}>
                下载导入模板
              </Button>
              <Button type="primary" style={{ marginRight: 8 }}>
                导入
              </Button>
              <Button type="primary" style={{ marginRight: 8 }}>
                导出
              </Button>
              <Button type="danger" ghost>
                删除
              </Button>
            </div>

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
        </Layout>
      </Card>
    </PageHeaderWrapper>
  );
}

export default DutyaccordingSetting;
