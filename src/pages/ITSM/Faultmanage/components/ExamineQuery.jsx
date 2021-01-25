import React from 'react';
import {
    Radio
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const { Description } = DescriptionList;
const RadioGroup = Radio.Group;

function ExamineQuery(props) {
    const { info } = props;

    return (
        <div style={{ paddingLeft: 45, paddingTop: 10 }}>
            <>
                <DescriptionList size="large">
                    <Description term="审核结果">
                        <RadioGroup defaultValue={info.checkResult} disabled>
                            <Radio value='1'>通过</Radio>
                            <Radio value='0'>不通过</Radio>
                        </RadioGroup>
                    </Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="审核时间">{info.checkTime || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="审核意见">{info.checkOpinion || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="上传故障报告">
                        <RadioGroup defaultValue={Number(info.checkReportSign)} disabled>
                            <Radio value={0}>是</Radio>
                            <Radio value={1}>否</Radio>
                        </RadioGroup>
                    </Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="上传附件">
                        {info.checkAttachments && <Downloadfile files={info.checkAttachments} />}
                    </Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="审核人">{info.checkUser || ''}</Description>
                    <Description term="审核人单位">{info.checkUnit || ''}</Description>
                    <Description term="审核人部门">{info.checkDept || ''}</Description>
                </DescriptionList>
            </>
        </div>
    );
};

export default ExamineQuery;
