import React, { useRef, useImperativeHandle } from 'react';
import {
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

const SummaryQuery = React.forwardRef((props, ref) => {
    const { detailsdata } = props;

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
                detailsdata !== undefined && (
                    <>
                        <DescriptionList size="large">
                            <Description term="总结时间">{detailsdata.finishTime || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="总结说明">{detailsdata.finishContent || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="上传故障分析报告">xx故障分析报告.doc</Description>
                            <Description term="要求上传时间">{detailsdata.finishRequiredTime || ''}</Description>
                            <Description term="实际上传时间">{detailsdata.finishPracticeTime || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="上传附件">XXXX附件.doc</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="总结人">{detailsdata.finishUser || ''}</Description>
                            <Description term="总结人单位">{detailsdata.finishUnit || ''}</Description>
                            <Description term="总结人部门">{detailsdata.finishDept || ''}</Description>
                        </DescriptionList>
                    </>
                )
            }
        </div>
    );
});

export default SummaryQuery;
