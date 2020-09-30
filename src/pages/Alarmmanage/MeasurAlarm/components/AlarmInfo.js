/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Tag, Badge } from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

const gradeMap = ['red', 'orange', 'blue'];
const grade = ['特急', '紧急', '一般'];

const ackstatusMap = ['success', 'error'];
const ackstatus = ['已确认', '未确认'];

const eliminateMap = ['error', 'success', 'default'];
const eliminate = ['未消除', '已消除', '已取消'];

class AlarmInfo extends Component {
  render() {
    const { data } = this.props;
    return (
      <DescriptionList size="large">
        <Description term="告警编号">{data.detailsid}</Description>
        <Description term="告警类别">{data.category}</Description>
        <Description term="告警子类">{data.childcategory}</Description>
        <Description term="最新发生时间">{data.latesttime}</Description>
        <Description term="消除时间">{data.eliminatetime}</Description>
        <Description term="持续时间">{data.duration}</Description>
        <Description term="紧急程度">
          <Tag color={gradeMap[data.grade]}>{grade[data.grade]}</Tag>
        </Description>
        <Description term="受影响资源">{data.resoure}</Description>
        <Description term="告警内容">{data.detailname}</Description>
        <Description term="告警规则">{data.alarmrules}</Description>
        <Description term="上次告警时间">{data.lasttime}</Description>
        <Description term="事件单生成">{data.eventlist}</Description>
        <Description term="事件单号">{data.eventnumber}</Description>
        <Description term="确认状态">
          <Badge status={ackstatusMap[data.ackstatus]} text={ackstatus[data.ackstatus]} />
        </Description>
        <Description term="消除状态">
          <Badge status={eliminateMap[data.eliminate]} text={eliminate[data.eliminate]} />
        </Description>
        <div style={{ padding: '0 30px 16px 16px' }}>
          <span style={{ display: 'table-cell', whiteSpace: 'nowrap' }}>备注 :</span>
          <div style={{ display: 'table-cell', paddingLeft: '10px' }}>{data.remarks}</div>
        </div>
      </DescriptionList>
    );
  }
}

export default AlarmInfo;
