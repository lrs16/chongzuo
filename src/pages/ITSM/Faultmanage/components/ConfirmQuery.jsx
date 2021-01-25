import React from 'react';
import {
    Radio
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const { Description } = DescriptionList;
const RadioGroup = Radio.Group;

function ConfirmQuery(props) {
    const { info } = props;

    return (
        <div style={{ paddingLeft: 45, paddingTop: 10 }}>
            <>
                <DescriptionList size="large">
                    <Description term="确认结果">
                        <RadioGroup defaultValue={info.confirmResult} disabled>
                            <Radio value='1'>通过</Radio>
                            <Radio value='0'>不通过</Radio>
                        </RadioGroup>
                    </Description>
                    <Description term="确认时间">{info.confirmTime || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="确认说明">{info.confirmContent || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="上传附件"> {info.confirmAttachments && <Downloadfile files={info.confirmAttachments} />}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="确认人">{info.confirmUser || ''}</Description>
                    <Description term="确认单位">{info.confirmUnit || ''}</Description>
                    <Description term="确认部门">{info.confirmDept || ''}</Description>
                </DescriptionList>
            </>
        </div>
    );
};

export default ConfirmQuery;