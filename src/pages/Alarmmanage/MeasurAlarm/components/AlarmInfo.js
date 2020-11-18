/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Badge } from 'antd';
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
      <>
        <DescriptionList size="large">
          <Description term="告警编号">{data.detailsid}</Description>
          <Description term="告警类别">{data.category}</Description>
          <Description term="告警子类">{data.childcategory}</Description>
          <Description term="告警发生时间">{data.latesttime}</Description>
          <Description term="消除时间">{data.eliminatetime}</Description>
          <Description term="持续时间">{data.duration}</Description>
          <Description term="告警等级">
            <p style={{backgroundColor:gradeMap[data.grade],width:'60px',textAlign:"center"}}>{grade[data.grade]}</p>
          </Description>
        </DescriptionList>

        <DescriptionList>
          <Description term="告警内容">{data.detailname}</Description>
        </DescriptionList>

        <DescriptionList>
          <Description term="告警规则">{data.alarmrules}</Description>
        </DescriptionList>

        <DescriptionList>
          <Description term="上次告警时间">{data.lasttime}</Description>
          <Description term="事件单生成">{data.eventlist}</Description>
          <Description term="事件单号">{data.eventnumber}</Description>
        </DescriptionList>

        <DescriptionList>
          <Description term="确认告警">
            <Badge status={ackstatusMap[data.ackstatus]} text={ackstatus[data.ackstatus]} />
          </Description>
          <Description term="消除告警">
            <Badge status={eliminateMap[data.eliminate]} text={eliminate[data.eliminate]} />
          </Description>
          <Description term="事件单号">
            <Badge status={eliminateMap[data.eliminate]} text={eliminate[data.eliminate]} />
          </Description>
        </DescriptionList>

        <DescriptionList>
          <div style={{ padding: '0 30px 16px 16px' }}>
            <span style={{ display: 'table-cell', whiteSpace: 'nowrap' }}>备注 :</span>
            <div style={{ display: 'table-cell', paddingLeft: '10px' }}>{data.remarks}</div>
          </div>
        </DescriptionList>
      </>
    );
  }
}

export default AlarmInfo;
