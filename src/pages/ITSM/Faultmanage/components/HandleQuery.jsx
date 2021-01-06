import React, { useRef, useImperativeHandle } from 'react';
import {
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

const HandleQuery = React.forwardRef((props, ref) => {
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
                            <Description term="故障详细描述">{detailsdata.handleContent || ''}</Description>
                            <Description term="故障分析及原因">{detailsdata.handleReason || ''}</Description>
                            <Description term="故障措施或建议">{detailsdata.handleAdvise || ''}</Description>
                            <Description term="故障处理开始时间">{detailsdata.handleStartTime || ''}</Description>
                            <Description term="故障恢复时间">{detailsdata.handleEndTime || ''}</Description>
                            <Description term="处理结果">{detailsdata.handleResult || ''}</Description>
                            <Description term="故障处理人">{detailsdata.handler || ''}</Description>
                            <Description term="上传故障处理记录表">故障处理记录表.doc</Description>
                            <Description term="上传附件">XXXX附件.doc</Description>
                        </DescriptionList>
                    </>
                )
            }
        </div>
    );
});

export default HandleQuery;
