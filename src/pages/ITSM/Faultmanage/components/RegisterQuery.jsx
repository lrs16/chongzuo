import React from 'react';
import {
    Radio
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import Downloadfile from '@/components/SysUpload/Downloadfile'; // 下载组件调用

const { Description } = DescriptionList;
const RadioGroup = Radio.Group;

function RegisterQuery (props){
    const { info, maindata } = props;

    return (
        <div style={{ paddingLeft: 45, paddingTop: 10 }}>
            <>
                <DescriptionList size="large">
                    <Description term="故障编号">{maindata.no || ''}</Description>
                    <Description term="登记时间">{info.registerTime || ''}</Description>
                    <Description term="发生时间">{info.registerOccurTime || ''}</Description>
                    <Description term="故障来源">{maindata.source || ''}</Description>
                    <Description term="系统模块">{info.registerModel || ''}</Description>
                    <Description term="故障类型">{maindata.type || ''}</Description>
                    <Description term="故障地点"> {info.registerAddress || ''}</Description>
                    <Description term="严重程度">{info.registerLevel || ''}</Description>
                    <Description term="影响范围">{info.registerScope || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="故障名称">{maindata.title || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="故障概要">{maindata.content || ''}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="是否影响业务">
                        <RadioGroup defaultValue={Number(info.registerEffect)} disabled>
                            <Radio value={0}>是</Radio>
                            <Radio value={1}>否</Radio>
                        </RadioGroup>
                    </Description>
                </DescriptionList>
                <DescriptionList size="large" span={3}>
                    <Description term="上传附件"> {info.registerAttachments && <Downloadfile files={info.registerAttachments} />}</Description>
                </DescriptionList>
                <DescriptionList size="large">
                    <Description term="登记人">{info.registerUser || ''}</Description>
                    <Description term="登记人单位">{info.registerUnit || ''}</Description>
                    <Description term="登记人部门">{info.registerDept || ''}</Description>
                </DescriptionList></>
        </div>
    );
};

export default RegisterQuery;
