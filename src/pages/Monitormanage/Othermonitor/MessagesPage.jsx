import React from 'react';
import { Card } from 'antd';
import GroupedColumn from '@/components/CustomizeCharts/GroupedColumn';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const data = [
  { name: '上行报文', type: '4504000939A', value: 20, alertvalue: 50 },
  { name: '上行报文', type: '4504000939B', value: 28, alertvalue: 50 },
  { name: '上行报文', type: '4504000939C', value: 39, alertvalue: 35 },
  { name: '上行报文', type: '4504000939D', value: 81, alertvalue: 50 },
  { name: '上行报文', type: '4504000939E', value: 47, alertvalue: 50 },
  { name: '下行报文', type: '4504000939A', value: 12, alertvalue: 50 },
  { name: '下行报文', type: '4504000939B', value: 23, alertvalue: 50 },
  { name: '下行报文', type: '4504000939C', value: 34, alertvalue: 35 },
  { name: '下行报文', type: '4504000939D', value: 99, alertvalue: 50 },
  { name: '下行报文', type: '4504000939E', value: 52, alertvalue: 50 },
]

const scale = {
  value: {
    min: 0,
    max: 100,
    alias: '连续报文数（次）',
  },
  alertvalue: {
    min: 0,
    max: 100,
    alias: '警戒值',
  },
};

function MessagesPage(props) {
  const pagetitle = props.route.name;
  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <Card>
        <GroupedColumn height={350} padding={[30, 10, 60, 60]} data={data} scale={scale} />
      </Card>
    </PageHeaderWrapper>
  );
}

export default MessagesPage;