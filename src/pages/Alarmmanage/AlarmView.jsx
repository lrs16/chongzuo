import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TypeContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import { querkeyVal } from '@/services/api';
import TotalInfo from './components/TotalInfo';
import Content from './Content';
import MessageContent from './MessageContent';
import All from './All';

const infolist = [
  { title: '告警总数', value: 1988, key: '1' },
  { title: '业务指标监控', value: 556, key: '2' },
  { title: '终端在线和入库', value: 3855, key: '3' },
  { title: '接口数据核查', value: 1, key: '4' },
  { title: 'KAFKA消费', value: 520, key: '5' },
  { title: '主站系统运维', value: 1, key: '6' },
]

function MeasurAlarm(props) {
  const pagetitle = props.route.name;
  const [tabActivekey, settabActivekey] = useState('today'); // 打开标签
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [tabkeyDist, setTabkeyDist] = useState([{ key: 'index1', tab: '加载中' }]);

  const pagetitlemap = new Map([
    ['计量业务告警', 'measuralarm'],
    ['主机巡检告警', 'hostalarm'],
    ['软件巡检告警', 'hostalarm'],
    ['应用程序运行状态告警', 'hostalarm'],
    ['配置文件变更告警', 'configurationfile'],
    ['时钟巡检告警', 'clockpatrol'],
  ]);

  const handleTabChange = key => {
    settabActivekey(key)
  };
  const tabList = [
    {
      key: 'today',
      tab: '今日告警',
    },
    {
      key: 'all',
      tab: '全部告警',
    },
  ];

  useEffect(() => {
    if (pagetitle !== '上下行报文页面告警') {
      querkeyVal('tabkey', pagetitlemap.get(pagetitle)).then(res => {
        if (res.code === 200) {
          const value = Object.values(res.data)[0];
          const newData = value.map(item => {
            return { key: item.key, tab: item.val }
          })
          setTabkeyDist(newData)
        }
      });
    } else {
      setTabkeyDist(null)
    }
  }, []);

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
      {tabActivekey === 'today' && (<TotalInfo infolist={infolist} />)}
      {tabActivekey === 'all' && (<All />)}
      <TypeContext.Provider value={{
        tabActivekey,
        pagetitle,
        selectdata,
      }}>

        {pagetitle === '上下行报文页面告警' ? <MessageContent tabActivekey={tabActivekey} /> : <Content match={props.match} tabkeyDist={tabkeyDist} distkey={pagetitlemap.get(pagetitle)} />}
      </TypeContext.Provider>
    </PageHeaderWrapper >
  );
}

export default MeasurAlarm;