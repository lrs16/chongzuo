import React from 'react';
import {
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const { Description } = DescriptionList;

function SummaryQuery(props) {
    const { info } = props;

    return (
        <div style={{ paddingLeft: 45, paddingTop: 10 }}>
            <>
                <DescriptionList size="large">
                    <Description term="总结时间">{info.finishTime || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="总结说明">{info.finishContent || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="上传故障分析报告">{info.finishAnalysisAttachments && <Downloadfile files={info.finishAnalysisAttachments} />}</Description>
                    <Description term="要求上传时间">{info.finishRequiredTime || ''}</Description>
                    <Description term="实际上传时间">{info.finishAnalysisAttachments && info.finishAnalysisAttachments === '[]' ? '' : (JSON.parse(info.finishAnalysisAttachments))[0].nowtime}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="上传附件">{info.finishAttachments && <Downloadfile files={info.finishAttachments} />}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="总结人">{info.finishUser || ''}</Description>
                    <Description term="总结人单位">{info.finishUnit || ''}</Description>
                    <Description term="总结人部门">{info.finishDept || ''}</Description>
                </DescriptionList>
            </>
        </div>
    );
};

export default SummaryQuery;