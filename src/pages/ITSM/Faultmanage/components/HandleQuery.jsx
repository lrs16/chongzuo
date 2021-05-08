import React from 'react';
import {
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const { Description } = DescriptionList;

function HandleQuery(props) {
  const { info } = props;

  return (
    <div style={{ paddingLeft: 45, paddingTop: 10 }}>
      <>
        <DescriptionList size="large">
          <Description term="故障详细描述">{info.handleContent || ''}</Description>
        </DescriptionList>
        <DescriptionList size="large">
          <Description term="故障分析及原因">{info.handleReason || ''}</Description>
        </DescriptionList>
        <DescriptionList size="large">
          <Description term="故障措施或建议">{info.handleAdvise || ''}</Description>
        </DescriptionList>
        <DescriptionList size="large">
          <Description term="处理开始时间">{info.handleStartTime || ''}</Description>
          <Description term="处理完成时间">{info.handleEndTime || ''}</Description>
          <Description term="处理结果">{info.handleResult || ''}</Description>
        </DescriptionList>
        <DescriptionList size="large">
          <Description term="上传故障处理记录表">{info.handleRecordAttachments && <Downloadfile files={info.handleRecordAttachments} />}</Description>
        </DescriptionList>
        <DescriptionList size="large">
          <Description term="上传故障系统截图">{info.handlePictureAttachments && <Downloadfile files={info.handlePictureAttachments} />}</Description>
        </DescriptionList>
        <DescriptionList size="large">
          <Description term="上传附件">{info.handleAttachments && <Downloadfile files={info.handleAttachments} />}</Description>
        </DescriptionList>
        <DescriptionList size="large">
          <Description term="处理人">{info.handler || ''}</Description>
          <Description term="处理人单位">{info.handleUnit || ''}</Description>
          <Description term="处理人部门">{info.handleDept || ''}</Description>
        </DescriptionList>
      </>
    </div>
  );
};

export default HandleQuery;