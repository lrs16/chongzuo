import React, { useRef, useImperativeHandle } from 'react';
import {
    Radio
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const RadioGroup = Radio.Group;

const RegisterQuery = React.forwardRef((props, ref) => {
    const { detailsdata, maindata } = props;
    const attRef = useRef();
    useImperativeHandle(
        ref,
        () => ({
            attRef,
        }),
        [],
    );

    return (
        <div style={{ paddingLeft: 45, paddingTop: 10 }}>
            {
                detailsdata !== undefined && maindata !== undefined && (
                    <>
                        <DescriptionList size="large">
                            <Description term="故障编号">{maindata.no || ''}</Description>
                            <Description term="登记时间">{detailsdata[0].registerTime || ''}</Description>
                            <Description term="发生时间">{detailsdata[0].registerOccurTime || ''}</Description>
                            <Description term="故障来源">{maindata.source || ''}</Description>
                            <Description term="系统模块">{detailsdata[0].registerModel || ''}</Description>
                            <Description term="故障类型">{maindata.type || ''}</Description>
                            <Description term="故障地点"> {detailsdata[0].registerAddress || ''}</Description>
                            <Description term="严重程度">{detailsdata[0].registerLevel || ''}</Description>
                            <Description term="影响范围">{detailsdata[0].registerScope || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="故障名称">{maindata.title || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="故障概要">{maindata.content || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="是否影响业务">
                                <RadioGroup defaultValue={Number(detailsdata[0].registerEffect)} disabled>
                                    <Radio value={0}>是</Radio>
                                    <Radio value={1}>否</Radio>
                                </RadioGroup>
                            </Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="上传附件">上传附件</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="填报人">{detailsdata[0].registerUser || ''}</Description>
                            <Description term="填报人单位">{detailsdata[0].registerUnit || ''}</Description>
                            <Description term="填报人部门">{detailsdata[0].registerDept || ''}</Description>
                        </DescriptionList></>
                )
            }
        </div>
    );
});

export default RegisterQuery;
